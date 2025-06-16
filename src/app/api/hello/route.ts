import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/features/auth/firebase/admin'

export async function GET(request: NextRequest) {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        message: 'Hello from TanStack Query!!! (認証なし)',
      })
    }

    const idToken = authHeader.substring(7) // "Bearer " を除去

    // Firebase Admin SDKでトークンを検証
    const decodedToken = await auth.verifyIdToken(idToken)

    return NextResponse.json({
      message: `Hello ${decodedToken.name || decodedToken.email}! 認証済みリクエストです。`,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      },
    })
  } catch (error) {
    console.error('トークン検証エラー:', error)
    return NextResponse.json(
      {
        message: 'トークンが無効です',
        error: 'Invalid token',
      },
      { status: 401 }
    )
  }
}
