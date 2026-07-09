import { createClient } from '@libsql/client'

let _client = null

export function getDb() {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return _client
}

export async function ensureSchema() {
  const db = getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_data (
      user_id      TEXT PRIMARY KEY,
      history_json TEXT NOT NULL DEFAULT '[]',
      settings_json TEXT NOT NULL DEFAULT '{}',
      updated_at   INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `)
}
