'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { signInWithGoogle } from '@/features/auth/firebase/client'

// Googleアイコンコンポーネント
const GoogleIcon = () => (
  <svg className='w-10 h-10' viewBox='0 0 24 24' fill='currentColor'>
    <path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill='#4285F4'
    />
    <path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill='#34A853'
    />
    <path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill='#EA4335'
    />
  </svg>
)

// ローディングアイコンコンポーネント
const LoadingIcon = () => (
  <svg className='w-10 h-10 animate-spin text-white' fill='none' viewBox='0 0 24 24'>
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
)

function GoogleLogin() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    const startTime = performance.now()

    try {
      setIsLoading(true)
      console.log('🚀 Googleログインプロセスを開始します...')

      // FirebaseでGoogleログインしてidTokenを取得
      const tokenStartTime = performance.now()
      const { user, idToken } = await signInWithGoogle()
      const tokenEndTime = performance.now()
      const tokenElapsedTime = Math.round(tokenEndTime - tokenStartTime)
      console.log(
        `🔑 FirebaseからのIDトークン取得が完了しました（所要時間: ${tokenElapsedTime}ms）`
      )

      // トークンをlocalStorageに保存
      const result = await user.getIdTokenResult()
      const expiry = new Date(result.expirationTime).getTime() / 1000

      if (typeof window !== 'undefined') {
        localStorage.setItem('firebase_id_token', idToken)
        localStorage.setItem('firebase_token_expiry', expiry.toString())
        console.log('💾 IDトークンをLocalStorageに保存しました')
      }

      // NextAuthにidTokenを渡してセッション作成
      console.log('🔄 NextAuthセッションの作成を開始します...')
      await signIn('credentials', {
        idToken,
        callbackUrl: '/home',
      })

      const endTime = performance.now()
      const totalElapsedTime = Math.round(endTime - startTime)
      console.log(`✅ Googleログインプロセスが完了しました（総所要時間: ${totalElapsedTime}ms）`)
    } catch (error) {
      const endTime = performance.now()
      const totalElapsedTime = Math.round(endTime - startTime)
      console.error(`❌ ログインエラー（所要時間: ${totalElapsedTime}ms）:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className='w-full max-w-xs bg-black hover:bg-gray-800 text-white border-0 rounded-lg py-6 px-6 font-medium transition-all duration-200 ease-in-out flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed'
    >
      {isLoading ? <LoadingIcon /> : <GoogleIcon />}
      <p className='text-lg font-bold'>{isLoading ? 'ログイン中...' : 'Googleでログイン'}</p>
    </Button>
  )
}

export default GoogleLogin
