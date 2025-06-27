import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { usersApi } from '@/lib/api/users'

const firebaseConfig = {
  apiKey: "AIzaSyCSEyLh1n3Hcy1Hj5kibunBjUgZrRMoUhI",
  authDomain: "zenn-ai-agent-hackathon-460205.firebaseapp.com",
  projectId: "zenn-ai-agent-hackathon-460205",
  storageBucket: "zenn-ai-agent-hackathon-460205.firebasestorage.app",
  messagingSenderId: "696136807010",
  appId: "1:696136807010:web:bb40b8f7f7f29bb660173b"
};

const app = getApps()?.length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Googleログイン機能
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()
    
    // バックエンドにユーザー情報を送信
    await syncUserWithBackend(result.user)
    
    return { user: result.user, idToken }
  } catch (error) {
    console.error('Firebase Google sign in error:', error)
    throw error
  }
}

// バックエンドとユーザー情報を同期
export const syncUserWithBackend = async (firebaseUser: {
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
}) => {
  try {
    console.log('🔄 バックエンドとユーザー情報を同期中...')
    
    // emailは必須なのでチェック
    if (!firebaseUser.email) {
      throw new Error('Email is required for user sync')
    }
    
    const userData = {
      name: firebaseUser.displayName || 'Unknown User',
      gmail: firebaseUser.email,
      icon_url: firebaseUser.photoURL || undefined
    }
    
    const backendUser = await usersApi.findOrCreate(userData)
    
    console.log('✅ バックエンドとの同期完了:', backendUser)
    return backendUser
  } catch (error) {
    console.error('❌ バックエンドとの同期に失敗:', error)
    // ログイン自体は成功させる（バックエンドエラーでログインが失敗しないように）
    return null
  }
}

// ログアウト機能
export const firebaseSignOut = async () => {
  try {
    await signOut(auth)
    
    // localStorageからトークンをクリア
    const { clearIdToken } = await import('@/lib/auth-token')
    clearIdToken()
    
    console.log('✅ ログアウト完了')
  } catch (error) {
    console.error('Firebase sign out error:', error)
    throw error
  }
}
