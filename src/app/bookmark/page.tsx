import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/features/auth/config/authOptions'
import { BookmarkClient } from './components/BookmarkClient'

const BookmarkPage = async () => {
  // サーバーサイドでセッションを確認
  const session = await getServerSession(authOptions)

  // ログインしていない場合はルートにリダイレクト
  if (!session) {
    redirect('/')
  }

  return <BookmarkClient />
}

export default BookmarkPage
