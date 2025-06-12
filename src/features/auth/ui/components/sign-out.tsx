'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { firebaseSignOut } from '@/features/auth/firebase/client'

function SignOut() {
  const handleSignOut = async () => {
    try {
      // Firebaseからもログアウト
      await firebaseSignOut()
      // NextAuthからログアウト
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  return (
    <Button onClick={handleSignOut} variant='outline'>
      ログアウト
    </Button>
  )
}

export default SignOut
