'use client'

import { auth } from '@/features/auth/firebase/client'
import { onAuthStateChanged, User } from 'firebase/auth'

// LocalStorageのキー
const TOKEN_KEY = 'firebase_id_token'
const TOKEN_EXPIRY_KEY = 'firebase_token_expiry'

// トークンの型定義
interface TokenData {
  token: string
  expiry: number
}

// LocalStorageからトークンを取得
const getStoredToken = (): TokenData | null => {
  const startTime = performance.now()

  if (typeof window === 'undefined') {
    console.log('🌐 サーバーサイドレンダリング環境のため、トークンは取得できません')
    return null
  }

  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)

    const endTime = performance.now()
    const elapsedTime = Math.round(endTime - startTime)

    if (!token || !expiry) {
      console.log(`📭 保存されたトークンが見つかりません（確認時間: ${elapsedTime}ms）`)
      return null
    }

    console.log(`📦 保存されたトークンを取得しました（所要時間: ${elapsedTime}ms）`)
    return {
      token,
      expiry: parseInt(expiry, 10),
    }
  } catch (error) {
    const endTime = performance.now()
    const elapsedTime = Math.round(endTime - startTime)
    console.error(`❌ トークンの取得に失敗しました（所要時間: ${elapsedTime}ms）:`, error)
    return null
  }
}

// LocalStorageにトークンを保存
const storeToken = (token: string, expiry: number): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString())
  } catch (error) {
    console.error('トークンの保存に失敗しました:', error)
  }
}

// LocalStorageからトークンを削除
const clearStoredToken = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
  } catch (error) {
    console.error('トークンの削除に失敗しました:', error)
  }
}

// トークンが有効期限内かチェック
const isTokenValid = (expiry: number): boolean => {
  const startTime = performance.now()

  const now = Date.now() / 1000 // 秒単位
  const buffer = 5 * 60 // 5分のバッファを設ける
  const isValid = expiry > now + buffer

  const endTime = performance.now()
  const elapsedTime = Math.round(endTime - startTime)

  const expiryDate = new Date(expiry * 1000).toLocaleString()
  console.log(
    `⏰ トークン有効性チェック完了: ${
      isValid ? '有効' : '無効'
    } (期限: ${expiryDate})（所要時間: ${elapsedTime}ms）`
  )

  return isValid
}

// 現在のユーザーから新しいトークンを取得
const getNewToken = async (user: User): Promise<TokenData | null> => {
  const startTime = performance.now()

  try {
    console.log('🔄 新しいIDトークンの取得を開始します...')

    const token = await user.getIdToken(true) // forceRefresh = true
    const result = await user.getIdTokenResult()

    const tokenData: TokenData = {
      token,
      expiry: new Date(result.expirationTime).getTime() / 1000,
    }

    storeToken(tokenData.token, tokenData.expiry)

    const endTime = performance.now()
    const elapsedTime = Math.round(endTime - startTime)
    console.log(`✅ 新しいIDトークンの取得が完了しました（所要時間: ${elapsedTime}ms）`)

    return tokenData
  } catch (error) {
    const endTime = performance.now()
    const elapsedTime = Math.round(endTime - startTime)
    console.error(`❌ 新しいトークンの取得に失敗しました（所要時間: ${elapsedTime}ms）:`, error)
    return null
  }
}

// メインのトークン取得関数
export const getIdToken = async (): Promise<string | null> => {
  const startTime = performance.now()

  try {
    console.log('🔍 IDトークンの取得を開始します...')

    // まず保存されたトークンをチェック（Firebase認証確認前）
    const storedToken = getStoredToken()
    if (storedToken && isTokenValid(storedToken.expiry)) {
      const endTime = performance.now()
      const elapsedTime = Math.round(endTime - startTime)
      console.log(`⚡ 保存されたIDトークンを即座に使用します（所要時間: ${elapsedTime}ms）`)
      return storedToken.token
    }

    // 保存されたトークンが無効/存在しない場合、現在のユーザーを確認
    const currentUser = auth.currentUser
    if (currentUser) {
      // ユーザーが既に認証済みの場合、新しいトークンを取得
      const newTokenData = await getNewToken(currentUser)
      const endTime = performance.now()
      const elapsedTime = Math.round(endTime - startTime)

      if (newTokenData?.token) {
        console.log(`✅ IDトークンの取得が完了しました（総所要時間: ${elapsedTime}ms）`)
        return newTokenData.token
      } else {
        console.error(`❌ IDトークンの取得に失敗しました（総所要時間: ${elapsedTime}ms）`)
        return null
      }
    }

    // ユーザーの認証状態が不明な場合のみonAuthStateChangedを使用
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe() // 一度だけ実行するためにunsubscribe

        if (!user) {
          clearStoredToken()
          const endTime = performance.now()
          const elapsedTime = Math.round(endTime - startTime)
          console.log(`ℹ️ ユーザーが認証されていません（確認時間: ${elapsedTime}ms）`)
          resolve(null)
          return
        }

        try {
          // トークンが無効または存在しない場合は新しく取得
          const newTokenData = await getNewToken(user)
          const endTime = performance.now()
          const elapsedTime = Math.round(endTime - startTime)

          if (newTokenData?.token) {
            console.log(`✅ IDトークンの取得が完了しました（総所要時間: ${elapsedTime}ms）`)
          } else {
            console.error(`❌ IDトークンの取得に失敗しました（総所要時間: ${elapsedTime}ms）`)
          }

          resolve(newTokenData?.token || null)
        } catch (error) {
          const endTime = performance.now()
          const elapsedTime = Math.round(endTime - startTime)
          console.error(
            `❌ トークンの処理中にエラーが発生しました（所要時間: ${elapsedTime}ms）:`,
            error
          )
          clearStoredToken()
          resolve(null)
        }
      })
    })
  } catch (error) {
    const endTime = performance.now()
    const elapsedTime = Math.round(endTime - startTime)
    console.error(
      `❌ IDトークン取得プロセスでエラーが発生しました（所要時間: ${elapsedTime}ms）:`,
      error
    )
    clearStoredToken()
    return null
  }
}

// トークンをクリアする関数（ログアウト時など）
export const clearIdToken = (): void => {
  clearStoredToken()
}

// トークンが存在するかチェックする関数
export const hasValidToken = (): boolean => {
  const storedToken = getStoredToken()
  return storedToken !== null && isTokenValid(storedToken.expiry)
}
