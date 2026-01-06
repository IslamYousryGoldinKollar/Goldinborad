import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuditLogService } from '../../../common/audit/audit-log.service';
import { AuthenticatedUser } from '../../../common/tenancy/tenant-scoped-request.interface';
import { CLAIM_REVIEW_ROLES } from '../../../common/rbac/permission-registry';
import { PointsLedgerService, PointsTransaction } from './points-ledger.service';

export interface ClaimRecord {
  claimId: string;
  userId: string;
  tenantId: string;
  missionId: string;
  pointsAwarded: number;
  status: 'pending' | 'kept' | 'revoked';
  reason?: string;
}

@Injectable()
export class ClaimReviewService {
  constructor(
    private readonly auditLog: AuditLogService,
    private readonly pointsLedger: PointsLedgerService,
  ) {}

  private assertReviewer(user: AuthenticatedUser): void {
    const hasReviewerRole = user.roles.some((role) => CLAIM_REVIEW_ROLES.has(role));
    if (!hasReviewerRole) {
      throw new ForbiddenException('ERR.AUTH.FORBIDDEN');
    }
  }

  async keepClaim(claim: ClaimRecord, reviewer: AuthenticatedUser, reason?: string): Promise<ClaimRecord> {
    this.assertReviewer(reviewer);

    if (claim.status !== 'pending') {
      throw new BadRequestException('ERR.CLAIM.ALREADY_REVIEWED');
    }

    const updated: ClaimRecord = { ...claim, status: 'kept', reason };
    await this.auditLog.record(
      this.auditLog.buildEntry(reviewer, 'CLAIM_REVIEW_KEEP', 'claim', claim.claimId, {
        missionId: claim.missionId,
        reason,
      }),
    );

    return updated;
  }

  async revokeClaim(
    claim: ClaimRecord,
    originalPoints: PointsTransaction,
    reviewer: AuthenticatedUser,
    reason: string,
  ): Promise<{ claim: ClaimRecord; reversal: PointsTransaction }> {
    this.assertReviewer(reviewer);

    if (claim.status !== 'pending') {
      throw new BadRequestException('ERR.CLAIM.ALREADY_REVIEWED');
    }

    if (!reason) {
      throw new BadRequestException('ERR.CLAIM.REVOKE_REASON_REQUIRED');
    }

    const reversal = await this.pointsLedger.createReversalTransaction(originalPoints, reason);
    const updated: ClaimRecord = { ...claim, status: 'revoked', reason };

    await this.auditLog.record(
      this.auditLog.buildEntry(reviewer, 'CLAIM_REVIEW_REVOKE', 'claim', claim.claimId, {
        missionId: claim.missionId,
        reason,
        reversalOf: originalPoints.transactionId,
      }),
    );

    return { claim: updated, reversal };
  }
}
