import { getDb, ensureSchema } from './_db.js'
import { getUserId } from './_auth.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const userId = await getUserId(req)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  await ensureSchema()
  const db = getDb()

  // ── GET: load history + settings ────────────────────────────────────────────
  if (req.method === 'GET') {
    const result = await db.execute({
      sql: 'SELECT history_json, settings_json FROM user_data WHERE user_id = ?',
      args: [userId],
    })
    if (result.rows.length === 0) {
      return res.status(200).json({ history: [], settings: null })
    }
    const row = result.rows[0]
    return res.status(200).json({
      history: JSON.parse(row.history_json),
      settings: JSON.parse(row.settings_json),
    })
  }

  // ── PUT: save history and/or settings (partial updates supported) ────────────
  if (req.method === 'PUT') {
    const { history, settings } = req.body ?? {}
    const hasHistory = history !== undefined
    const hasSettings = settings !== undefined

    if (!hasHistory && !hasSettings) {
      return res.status(400).json({ error: 'Nothing to save' })
    }

    const historyJson = hasHistory ? JSON.stringify(history) : null
    const settingsJson = hasSettings ? JSON.stringify(settings) : null

    if (hasHistory && hasSettings) {
      await db.execute({
        sql: `INSERT INTO user_data (user_id, history_json, settings_json, updated_at)
              VALUES (?, ?, ?, unixepoch())
              ON CONFLICT(user_id) DO UPDATE SET
                history_json  = excluded.history_json,
                settings_json = excluded.settings_json,
                updated_at    = excluded.updated_at`,
        args: [userId, historyJson, settingsJson],
      })
    } else if (hasHistory) {
      await db.execute({
        sql: `INSERT INTO user_data (user_id, history_json, settings_json, updated_at)
              VALUES (?, ?, '{}', unixepoch())
              ON CONFLICT(user_id) DO UPDATE SET
                history_json = excluded.history_json,
                updated_at   = excluded.updated_at`,
        args: [userId, historyJson],
      })
    } else {
      await db.execute({
        sql: `INSERT INTO user_data (user_id, history_json, settings_json, updated_at)
              VALUES (?, '[]', ?, unixepoch())
              ON CONFLICT(user_id) DO UPDATE SET
                settings_json = excluded.settings_json,
                updated_at    = excluded.updated_at`,
        args: [userId, settingsJson],
      })
    }

    return res.status(200).json({ ok: true })
  }

  // ── DELETE: reset (clear history only, keep settings) ───────────────────────
  if (req.method === 'DELETE') {
    await db.execute({
      sql: `UPDATE user_data SET history_json = '[]', updated_at = unixepoch()
            WHERE user_id = ?`,
      args: [userId],
    })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
