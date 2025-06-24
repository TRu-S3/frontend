'use client'

import React from 'react'
import { Session } from 'next-auth'
import GoogleLogin from './google-login'
import SignOut from './sign-out'

interface LoginProps {
  session: Session | null
}

function Login({ session }: LoginProps) {
  if (session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-0 space-y-4'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>ようこそ！</h1>
          <p className='text-gray-600 mb-2'>ログイン済み: {session.user?.name}</p>
          <p className='text-gray-500 text-sm mb-6'>{session.user?.email}</p>
        </div>
        <SignOut />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-0 space-y-4'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>ログイン</h1>
        <p className='text-gray-600'>Googleアカウントでログインしてください</p>
      </div>
      <GoogleLogin />
    </div>
  )
}

export default Login
