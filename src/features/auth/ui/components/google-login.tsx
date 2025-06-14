'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { signInWithGoogle } from '@/features/auth/firebase/client'

function GoogleLogin() {
  const handleGoogleSignIn = async () => {
    try {
      // FirebaseでGoogleログインしてidTokenを取得
      const { idToken } = await signInWithGoogle()

      // NextAuthにidTokenを渡してセッション作成
      await signIn('credentials', {
        idToken,
        callbackUrl: '/home',
      })
    } catch (error) {
      console.error('ログインエラー:', error)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      className='w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white'
    >
      Googleでログイン
    </Button>
  )
}

export default GoogleLogin
