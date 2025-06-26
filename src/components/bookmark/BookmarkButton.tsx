'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkButtonProps {
  targetUserId: number
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export const BookmarkButton = ({ 
  targetUserId, 
  size = 'default', 
  variant = 'outline',
  className = '' 
}: BookmarkButtonProps) => {
  const { user: currentUser } = useCurrentUser()
  const { isBookmarked, toggleBookmark } = useBookmarks({ 
    userId: currentUser?.id,
    autoFetch: true 
  })
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    console.log('🔖 BookmarkButton: ハンドルトグル開始', { currentUser: currentUser?.id, targetUserId })
    
    if (!currentUser || currentUser.id === targetUserId) {
      console.log('🔖 BookmarkButton: ユーザーなしまたは自分自身 - スキップ')
      return
    }

    setLoading(true)
    try {
      console.log('🔖 BookmarkButton: toggleBookmark呼び出し')
      await toggleBookmark(targetUserId)
      console.log('🔖 BookmarkButton: toggleBookmark完了')
    } catch (error) {
      console.error('🔖 BookmarkButton: Failed to toggle bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser || currentUser.id === targetUserId) {
    return null // 自分自身はブックマークできない
  }

  const bookmarked = isBookmarked(targetUserId)
  
  console.log('🔖 BookmarkButton: レンダリング', { 
    currentUserId: currentUser?.id, 
    targetUserId, 
    bookmarked,
    hasCurrentUser: !!currentUser
  })

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleToggle}
      disabled={loading}
      className={`${bookmarked 
        ? 'text-red-500 hover:text-red-600 border-red-200 hover:border-red-300' 
        : 'text-gray-500 hover:text-red-500 hover:border-red-200'
      } ${className}`}
    >
      {loading ? (
        <Loader2 className='w-4 h-4 animate-spin' />
      ) : (
        <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      )}
      {size !== 'sm' && (
        <span className='ml-2'>
          {bookmarked ? 'ブックマーク済み' : 'ブックマーク'}
        </span>
      )}
    </Button>
  )
}

export default BookmarkButton