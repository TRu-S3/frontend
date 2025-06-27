'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, Loader2 } from 'lucide-react'
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
    if (!currentUser || currentUser.id === targetUserId) {
      return
    }

    setLoading(true)
    try {
      await toggleBookmark(targetUserId)
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser || currentUser.id === targetUserId) {
    return null // 自分自身はブックマークできない
  }

  const bookmarked = isBookmarked(targetUserId)

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleToggle}
      disabled={loading}
      className={`${bookmarked 
        ? 'text-yellow-500 hover:text-yellow-600 border-yellow-200 hover:border-yellow-300' 
        : 'text-gray-500 hover:text-yellow-500 hover:border-yellow-200'
      } ${className}`}
    >
      {loading ? (
        <Loader2 className='w-4 h-4 animate-spin' />
      ) : (
        <Star className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
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