'use client'

import Popup from '@/components/ui/Popup'
import Login from '@/features/auth/ui/components/Login'
import { useSession } from 'next-auth/react'
import React from 'react'

interface LoginPopupProps {
  trigger: React.ReactNode
}

export default function LoginPopup({ trigger }: LoginPopupProps) {
  const { data: session } = useSession()

  return (
    <Popup trigger={trigger}>
      <div className='w-full min-h-[320px] flex items-center justify-center'>
        <Login session={session} />
      </div>
    </Popup>
  )
}
