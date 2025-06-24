import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import React from 'react'
import { X } from 'lucide-react'

interface PopupProps {
  trigger: React.ReactNode
  title?: string
  children: React.ReactNode
}

export default function Popup({ trigger, title = 'モーダル', children }: PopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>{trigger}</div>
      </DialogTrigger>
      <DialogContent className='fixed top-1/2 left-1/2 z-[60] sm:max-w-[400px] w-full max-w-[calc(100%-2rem)] p-6 bg-white rounded-xl shadow-lg border border-gray-200 -translate-x-1/2 -translate-y-1/2'>
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden.Root>
        <DialogClose asChild>
          <button
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition'
            aria-label='閉じる'
          >
            <X className='w-5 h-5' />
          </button>
        </DialogClose>
        <div className='mt-4'>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
