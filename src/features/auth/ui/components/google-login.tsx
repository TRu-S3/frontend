import React from 'react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

function GoogleLogin() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
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
