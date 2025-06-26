'use client'

import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, User, BookmarkX, Loader2 } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useBookmarks } from '@/hooks/useBookmarks'

export const BookmarkClient = () => {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { bookmarkedUsers, loading: bookmarksLoading, error, removeBookmark } = useBookmarks({ 
    userId: currentUser?.id,
    autoFetch: true 
  })
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'created_at'>('created_at')

  console.log('🔖 BookmarkClient: レンダリング', { 
    currentUser: currentUser?.id, 
    bookmarkedUsersLength: bookmarkedUsers.length,
    bookmarkedUsers,
    userLoading,
    bookmarksLoading,
    error
  })

  const handleRemoveBookmark = async (userId: number) => {
    if (!currentUser) return
    
    try {
      await removeBookmark(userId)
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
    }
  }

  const sortedUsers = [...bookmarkedUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  // ローディング状態
  if (userLoading || bookmarksLoading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>ブックマークを読み込み中...</span>
        </div>
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 mb-2'>{error}</div>
          <Button onClick={() => window.location.reload()}>
            再読み込み
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* ヘッダー */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Heart className='w-6 h-6 text-red-500 fill-current' />
              <h1 className='text-2xl font-bold text-gray-900'>ブックマーク</h1>
              <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium'>
                {bookmarkedUsers.length}人
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='sort-select' className='text-sm text-gray-500'>
                並び替え:
              </label>
              <select
                id='sort-select'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className='px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
              >
                <option value='created_at'>追加日時</option>
                <option value='name'>名前</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {bookmarkedUsers.length === 0 ? (
          <div className='text-center py-16'>
            <Heart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-600 mb-2'>
              ブックマークしたユーザーがいません
            </h2>
            <p className='text-gray-500'>
              気になるユーザーをブックマークして、ここに表示させましょう。
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {sortedUsers.map((user) => (
              <Card
                key={user.id}
                className='hover:shadow-md transition-shadow duration-200 bg-white'
              >
                <CardContent className='p-6'>
                  <div className='flex items-start gap-4'>
                    {/* アバター */}
                    <Avatar className='w-14 h-14 border-2 border-gray-100'>
                      {user.icon_url ? (
                        <AvatarImage src={user.icon_url} alt={user.name} />
                      ) : (
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* メイン情報 */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900 mb-1'>{user.name}</h3>
                          <div className='flex items-center gap-4 text-sm text-gray-500 mb-2'>
                            <span className='flex items-center gap-1'>
                              <User className='w-4 h-4' />
                              {user.gmail}
                            </span>
                            <span>追加: {formatDate(user.created_at)}</span>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveBookmark(user.id)}
                          className='text-red-500 hover:text-red-700 hover:bg-red-50'
                        >
                          <BookmarkX className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='text-gray-700 mb-4'>
                        <p>登録日: {formatDate(user.created_at)}</p>
                        {user.updated_at && user.updated_at !== user.created_at && (
                          <p className='text-sm text-gray-500'>更新日: {formatDate(user.updated_at)}</p>
                        )}
                      </div>

                      {/* 連絡先情報 */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4 text-sm text-gray-600'>
                          <span>Gmail: {user.gmail}</span>
                        </div>
                        <div className='flex gap-2'>
                          <Button variant='outline' size='sm' className='hover:bg-gray-50'>
                            プロフィール表示
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
