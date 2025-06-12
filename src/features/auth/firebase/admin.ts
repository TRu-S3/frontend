import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// 環境変数のバリデーション
const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// 必要な環境変数がすべて設定されているかチェック
if (!requiredEnvVars.projectId || !requiredEnvVars.clientEmail || !requiredEnvVars.privateKey) {
  console.error('Firebase Admin SDK configuration error:')
  console.error('Missing required environment variables:')
  if (!requiredEnvVars.projectId) console.error('- FIREBASE_PROJECT_ID (or NEXT_PUBLIC_PROJECT_ID)')
  if (!requiredEnvVars.clientEmail) console.error('- FIREBASE_CLIENT_EMAIL')
  if (!requiredEnvVars.privateKey) console.error('- FIREBASE_PRIVATE_KEY')

  throw new Error(
    'Firebase Admin SDK configuration is incomplete. Please check your environment variables.'
  )
}

const serviceAccount = {
  projectId: requiredEnvVars.projectId,
  clientEmail: requiredEnvVars.clientEmail,
  privateKey: requiredEnvVars.privateKey,
}

export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
  })

export const auth = getAuth(firebaseAdmin)
