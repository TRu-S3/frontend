import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import React from 'react'

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
      <DialogContent className='fixed top-1/2 left-1/2 z-[60] py-4 px-6 bg-white rounded-xl shadow-lg border border-gray-200 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto w-[80vw] max-w-[80vw] min-w-[80vw]'>
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden.Root>
        <DialogClose asChild />
        <div className='mt-4'>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
