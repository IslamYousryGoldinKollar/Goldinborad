import { Injectable, BadRequestException } from '@nestjs/common';

export interface PointsTransaction {
  transactionId: string;
  userId: string;
  tenantId: string;
  amount: number;
  reason: string;
  relatedClaimId?: string;
  reversalOf?: string;
}

@Injectable()
export class PointsLedgerService {
  async createReversalTransaction(original: PointsTransaction, reason: string): Promise<PointsTransaction> {
    if (original.amount <= 0) {
      throw new BadRequestException('ERR.POINTS.INVALID_REVERSAL');
    }

    const reversal: PointsTransaction = {
      transactionId: `${original.transactionId}-REV`,
      userId: original.userId,
      tenantId: original.tenantId,
      amount: -Math.abs(original.amount),
      reason,
      relatedClaimId: original.relatedClaimId,
      reversalOf: original.transactionId,
    };

    // TODO: persist to points ledger
    return reversal;
  }
}
