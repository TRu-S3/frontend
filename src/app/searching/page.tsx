'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedProgress } from '@/app/searching/animated-progress'

export default function Searching() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/demo')
    }, 25000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className='min-h-screen w-full bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center'>
      <div className='container mx-auto px-4 -mt-20'>
        <AnimatedProgress />
      </div>
    </main>
  )
}
