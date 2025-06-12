import React from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

function SignOut() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Button onClick={handleSignOut} variant='outline'>
      ログアウト
    </Button>
  )
}

export default SignOut
