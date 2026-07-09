import { createClerkClient } from '@clerk/backend'

let _clerk = null

function getClerk() {
  if (!_clerk) {
    _clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  }
  return _clerk
}

/**
 * Extracts and verifies the Clerk session token from the Authorization header.
 * Returns the user_id (sub claim) on success, or null if missing/invalid.
 */
export async function getUserId(req) {
  const authHeader = req.headers['authorization'] ?? ''
  if (!authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  try {
    const payload = await getClerk().verifyToken(token)
    return payload.sub
  } catch {
    return null
  }
}
