import { PoolLike } from '../db'

type LeaderboardScope = 'tenant' | 'cohort' | 'team'
type LeaderboardTimeframe = 'weekly' | 'monthly' | 'all_time'

export interface LeaderboardEntry {
  user_id: string
  points: number
  rank: number
}

export interface LeaderboardFilters {
  tenantId: string
  scope: LeaderboardScope
  timeframe: LeaderboardTimeframe
  scopeEntityId?: string
  limit?: number
}

const EARNED_REASON_TYPES = ['mission_complete', 'knowledge_complete', 'assessment_complete']

export class LeaderboardService {
  constructor(private readonly pool: PoolLike) {}

  private timeframeClause(timeframe: LeaderboardTimeframe): string {
    if (timeframe === 'weekly') {
      return "created_at >= date_trunc('week', now())"
    }
    if (timeframe === 'monthly') {
      return "created_at >= date_trunc('month', now())"
    }
    return 'TRUE'
  }

  private scopeJoin(scope: LeaderboardScope, scopeEntityId: string | undefined, startIndex: number): { join: string; where: string; params: any[] } {
    const placeholder = `$${startIndex}`
    if (scope === 'cohort') {
      return {
        join: 'JOIN cohort_members cm ON cm.user_id = pt.user_id',
        where: `cm.cohort_id = ${placeholder}`,
        params: [scopeEntityId]
      }
    }
    if (scope === 'team') {
      return {
        join: 'JOIN team_members tm ON tm.user_id = pt.user_id',
        where: `tm.team_id = ${placeholder}`,
        params: [scopeEntityId]
      }
    }
    return { join: '', where: 'TRUE', params: [] }
  }

  async getLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardEntry[]> {
    const client = await this.pool.connect()
    try {
      const timeframePredicate = this.timeframeClause(filters.timeframe)

      const baseParams: any[] = [filters.tenantId, filters.limit ?? 50, EARNED_REASON_TYPES]
      const { join, where, params } = this.scopeJoin(filters.scope, filters.scopeEntityId, baseParams.length + 1)
      const allParams = [...baseParams, ...params]

      const query = `
        WITH earned AS (
          SELECT pt.user_id, SUM(pt.delta) AS points
          FROM points_transactions pt
          ${join}
          WHERE pt.tenant_id = $1
            AND pt.status = 'active'
            AND pt.reason_type = ANY($3)
            AND pt.delta > 0
            AND ${timeframePredicate}
            AND NOT EXISTS (
              SELECT 1 FROM leaderboard_opt_out lbo
              WHERE lbo.tenant_id = pt.tenant_id AND lbo.user_id = pt.user_id
            )
            AND ${where}
          GROUP BY pt.user_id
        )
        SELECT user_id, points, RANK() OVER (ORDER BY points DESC, user_id ASC) AS rank
        FROM earned
        ORDER BY rank ASC
        LIMIT $2`;

      const result = await client.query<LeaderboardEntry>(query, allParams)
      return result.rows
    } finally {
      if (client.release) client.release()
    }
  }
}
