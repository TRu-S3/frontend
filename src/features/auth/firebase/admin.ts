import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let firebaseApp

const isDev = process.env.NODE_ENV === 'development'

try {
  // まずApplication Default Credentialsを試す（Cloud Run環境、gcloud auth済みのローカル環境で動作）
  if (isDev) {
    console.log('Application Default Credentialsでの初期化を試行します')
  }
  firebaseApp =
    getApps()[0] ??
    initializeApp({
      credential: applicationDefault(),
    })
  if (isDev) {
    console.log('Application Default Credentialsでの初期化に成功しました')
  }
} catch {
  if (isDev) {
    console.log('Application Default Credentialsが利用できません。環境変数を使用します')
  }

  // 環境変数の取得
  const envVars = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'zenn-ai-agent-hackathon-460205',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  // 環境変数のバリデーション
  if (!envVars.projectId || !envVars.clientEmail || !envVars.privateKey) {
    console.error('Firebase Admin SDK configuration error:')
    console.error('Missing required environment variables:')
    if (!envVars.projectId) console.error('- FIREBASE_PROJECT_ID (or NEXT_PUBLIC_PROJECT_ID)')
    if (!envVars.clientEmail) console.error('- FIREBASE_CLIENT_EMAIL')
    if (!envVars.privateKey) console.error('- FIREBASE_PRIVATE_KEY')
    console.error('')
    console.error('または、以下のコマンドでGoogle Cloud CLIにログインしてください:')
    console.error('  gcloud auth application-default login')

    throw new Error(
      'Firebase Admin SDK configuration is incomplete. Please set environment variables or authenticate with Google Cloud CLI.'
    )
  }

  const serviceAccount = {
    projectId: envVars.projectId,
    clientEmail: envVars.clientEmail,
    privateKey: envVars.privateKey,
  }

  firebaseApp =
    getApps()[0] ??
    initializeApp({
      credential: cert(serviceAccount),
    })
  if (isDev) {
    console.log('環境変数からFirebase Admin SDKを初期化しました')
  }
}

export const firebaseAdmin = firebaseApp
export const auth = getAuth(firebaseAdmin)
