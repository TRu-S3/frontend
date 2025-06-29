'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { User as BackendUser } from '@/lib/api/users'
import BookmarkButton from '@/components/bookmark/BookmarkButton'

interface UserCardProps {
  user: BackendUser
  showBookmark?: boolean
  onUserClick?: (user: BackendUser) => void
  children?: React.ReactNode
}

export const UserCard = ({ user, showBookmark = true, onUserClick, children }: UserCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Card className='hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='flex flex-row items-center gap-4'>
        <Avatar className='w-16 h-16'>
          {user.icon_url ? (
            <AvatarImage src={user.icon_url} alt={user.name} />
          ) : (
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
              {getInitials(user.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className='flex-1'>
          <CardTitle className='text-lg'>{user.name}</CardTitle>
          <div className='flex items-center gap-2 mt-1 text-sm text-gray-500'>
            <User className='w-4 h-4' />
            <span>{user.gmail}</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {showBookmark && <BookmarkButton targetUserId={user.id} size='sm' />}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='text-gray-700'>
            <p className='mb-2'>
              こんにちは！私は{user.name}です！ハッカソンに一緒に出てくれる仲間を探しています！
            </p>
          </div>

          <div className='text-sm text-gray-500 space-y-1'>
            <p>登録日: {formatDate(user.created_at)}</p>
            {user.updated_at && user.updated_at !== user.created_at && (
              <p>更新日: {formatDate(user.updated_at)}</p>
            )}
          </div>

          {onUserClick && (
            <Button variant='outline' className='w-full' onClick={() => onUserClick(user)}>
              詳細を見る
            </Button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

export default UserCard
