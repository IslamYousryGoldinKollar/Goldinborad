export interface Queryable {
  query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>
  // release is optional to support PoolClient from `pg` while keeping the API narrow
  release?: () => void
}

export interface PoolLike {
  connect(): Promise<Queryable>
}

/**
 * Executes a callback inside a database transaction using a Pool-like interface (pg compatible).
 */
export async function withTransaction<T>(pool: PoolLike, fn: (client: Queryable) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    if (client.release) client.release()
  }
}
