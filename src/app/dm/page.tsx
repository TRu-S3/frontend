'use client'

import React, { useEffect } from 'react'
import ComingSoonPopup from '@/components/ui/ComingSoonPopup'
import { useComingSoon } from '@/hooks/useComingSoon'

export default function DmPage() {
  const { isOpen, featureName, openComingSoon, closeComingSoon } = useComingSoon()

  useEffect(() => {
    // ページ読み込み時にComing Soonポップアップを表示
    openComingSoon('DM')
  }, [])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='text-center space-y-4'>
        <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
          <svg
            className='w-12 h-12 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
        <h1 className='text-3xl font-bold text-gray-900'>DM機能</h1>
        <p className='text-gray-600 max-w-md'>
          この機能はGoogle Cloud Next Tokyo 2025でリリース予定です。
        </p>
      </div>

      <ComingSoonPopup
        open={isOpen}
        onOpenChange={closeComingSoon}
        featureName={featureName}
        description='DM機能は現在開発中です。Google Cloud Next Tokyo 2025でリリース予定です。'
      />
    </div>
  )
}
