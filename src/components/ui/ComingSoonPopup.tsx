'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, Star } from 'lucide-react'
interface ComingSoonPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName: string
  eventName?: string
  description?: string
}

export default function ComingSoonPopup({
  open,
  onOpenChange,
  featureName,
  eventName = 'Google Cloud Next Tokyo 2025',
  description,
}: ComingSoonPopupProps) {
  const defaultDescription = `${featureName}機能は現在開発中です。${eventName}でリリース予定です。`

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold text-gray-900'>
            <Star className='w-6 h-6 text-yellow-500' />
            Coming Soon!
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* メインメッセージ */}
          <div className='text-center space-y-3'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto'>
              <Calendar className='w-8 h-8 text-white' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>{featureName}</h3>
            <p className='text-gray-600 leading-relaxed'>{description || defaultDescription}</p>
          </div>

          {/* アクションボタン */}
          <div className='flex flex-col gap-3'>
            <Button
              className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
              onClick={handleClose}
            >
              了解しました
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
