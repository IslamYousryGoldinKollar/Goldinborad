import { PoolLike, Queryable, withTransaction } from '../db'

type ReasonType =
  | 'mission_complete'
  | 'knowledge_complete'
  | 'assessment_complete'
  | 'claim_revoke'
  | 'reward_redeem'
  | 'admin_adjust'
  | 'reversal'

export interface PointsTransaction {
  tx_id: string
  tenant_id: string
  user_id: string
  delta: number
  balance_after: number
  reason_type: ReasonType
  ref_id: string | null
  status: 'active' | 'reversed'
  reversal_of_tx_id: string | null
  created_by: string | null
  created_at: string
  notes: string | null
}

export interface EarnedTransactionInput {
  tenantId: string
  userId: string
  delta: number
  reasonType: Exclude<ReasonType, 'reversal'>
  refId?: string
  createdBy?: string
  notes?: string
}

export interface ReversalInput {
  tenantId: string
  userId: string
  originalTxId: string
  createdBy: string
  notes?: string
}

export class PointsLedgerDao {
  constructor(private readonly pool: PoolLike) {}

  /**
   * Append-only insert for positive/negative earned transactions.
   * Computes balance_after atomically inside a transaction.
   */
  async recordEarnedTransaction(input: EarnedTransactionInput): Promise<PointsTransaction> {
    return withTransaction(this.pool, async (client) => {
      const balanceResult = await client.query<{ balance_after: number }>(
        `SELECT COALESCE((SELECT balance_after FROM points_transactions
                          WHERE tenant_id = $1 AND user_id = $2
                          ORDER BY created_at DESC LIMIT 1), 0) AS balance_after`,
        [input.tenantId, input.userId]
      )

      const balanceAfter = balanceResult.rows[0].balance_after + input.delta

      const insertResult = await client.query<PointsTransaction>(
        `INSERT INTO points_transactions (
          tx_id, tenant_id, user_id, delta, balance_after,
          reason_type, ref_id, status, reversal_of_tx_id,
          created_by, notes
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4,
          $5, $6, 'active', NULL,
          $7, $8
        ) RETURNING *`,
        [input.tenantId, input.userId, input.delta, balanceAfter, input.reasonType, input.refId ?? null, input.createdBy ?? null, input.notes ?? null]
      )

      return insertResult.rows[0]
    })
  }

  /**
   * Creates a reversal transaction and marks the original as reversed without mutating its numeric fields.
   * The new row links to the original via reversal_of_tx_id so history stays intact.
   */
  async recordReversal(input: ReversalInput): Promise<PointsTransaction> {
    return withTransaction(this.pool, async (client: Queryable) => {
      const originalResult = await client.query<PointsTransaction>(
        `SELECT * FROM points_transactions
         WHERE tenant_id = $1 AND user_id = $2 AND tx_id = $3 AND status = 'active'
         FOR UPDATE`,
        [input.tenantId, input.userId, input.originalTxId]
      )

      if (originalResult.rows.length === 0) {
        throw new Error('Original transaction not found or already reversed')
      }

      const original = originalResult.rows[0]
      const balanceResult = await client.query<{ balance_after: number }>(
        `SELECT COALESCE((SELECT balance_after FROM points_transactions
                          WHERE tenant_id = $1 AND user_id = $2
                          ORDER BY created_at DESC LIMIT 1), 0) AS balance_after`,
        [input.tenantId, input.userId]
      )
      const balanceAfter = balanceResult.rows[0].balance_after - original.delta

      const reversalResult = await client.query<PointsTransaction>(
        `INSERT INTO points_transactions (
          tx_id, tenant_id, user_id, delta, balance_after,
          reason_type, ref_id, status, reversal_of_tx_id,
          created_by, notes
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4,
          'reversal', $5, 'active', $6,
          $7, $8
        ) RETURNING *`,
        [input.tenantId, input.userId, -original.delta, balanceAfter, original.ref_id, original.tx_id, input.createdBy, input.notes ?? null]
      )

      await client.query(
        `UPDATE points_transactions SET status = 'reversed' WHERE tx_id = $1`,
        [original.tx_id]
      )

      return reversalResult.rows[0]
    })
  }

  /**
   * Returns learner-facing ledger history ordered by newest first.
   */
  async listUserHistory(tenantId: string, userId: string, limit = 50, offset = 0): Promise<PointsTransaction[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query<PointsTransaction>(
        `SELECT tx_id, tenant_id, user_id, delta, balance_after, reason_type, ref_id, status, reversal_of_tx_id, created_by, created_at, notes
         FROM points_transactions
         WHERE tenant_id = $1 AND user_id = $2
         ORDER BY created_at DESC
         LIMIT $3 OFFSET $4`,
        [tenantId, userId, limit, offset]
      )
      return result.rows
    } finally {
      if (client.release) client.release()
    }
  }
}
