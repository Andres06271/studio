import fs from 'fs'

type AuthResult = { uid?: string; email?: string; method: 'api-key' | 'firebase' | 'anonymous' }

/**
 * Authorize incoming request. Supports:
 * - x-api-key header matching REPORTS_API_KEY env var
 * - Authorization: Bearer <idToken> verified via firebase-admin if available
 * Throws Response(401) when unauthorized.
 */
export async function authorize(req: Request): Promise<AuthResult> {
  const apiKey = process.env.REPORTS_API_KEY

  // 1) API key
  const keyHeader = req.headers.get('x-api-key')
  if (apiKey && keyHeader && keyHeader === apiKey) {
    return { method: 'api-key' }
  }

  // 2) Firebase ID token
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim()
    try {
      // dynamic import to avoid requiring firebase-admin if not used
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const admin = await import('firebase-admin')

      if (!admin.apps?.length) {
        // initialize with service account from env if provided
        const sa = process.env.FIREBASE_SERVICE_ACCOUNT
        if (sa) {
          const creds = JSON.parse(sa)
          admin.initializeApp({ credential: admin.credential.cert(creds) })
        } else {
          // try default application credentials
          admin.initializeApp()
        }
      }

      const decoded = await admin.auth().verifyIdToken(token)
      return { uid: decoded.uid, email: decoded.email, method: 'firebase' }
    } catch (err) {
      // verification failed or firebase-admin not available
      throw new Response('Unauthorized', { status: 401 })
    }
  }

  // If no auth provided, reject
  throw new Response('Unauthorized', { status: 401 })
}

export default authorize
