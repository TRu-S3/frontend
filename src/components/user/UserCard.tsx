'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Tag } from 'lucide-react'
import { User as BackendUser } from '@/lib/api/users'
import { useProfile } from '@/hooks/useProfile'
import BookmarkButton from '@/components/bookmark/BookmarkButton'
import { memo } from 'react'

interface UserCardProps {
  user: BackendUser
  showBookmark?: boolean
  onUserClick?: (user: BackendUser) => void
  children?: React.ReactNode
  compact?: boolean
}

export const UserCard = memo(
  ({ user, showBookmark = true, onUserClick, children, compact = false }: UserCardProps) => {
    const { profile } = useProfile({ userId: user.id })

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    }

    return (
      <Card
        className={`hover:shadow-md transition-shadow duration-200 ${compact ? 'max-w-xs p-2 text-xs' : ''}`}
      >
        <CardHeader className={`flex flex-row items-center gap-4 ${compact ? 'p-2' : ''}`}>
          <Avatar className={compact ? 'w-10 h-10' : 'w-16 h-16'}>
            {user.icon_url ? (
              <AvatarImage src={user.icon_url} alt={`${user.name}のプロフィール画像`} />
            ) : (
              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className='flex-1'>
            <CardTitle className={compact ? 'text-base' : 'text-lg'}>{user.name}</CardTitle>
            {/* プロフィール情報を表示 */}
            {profile && (
              <div
                className={`flex flex-wrap items-center gap-2 mt-1 text-gray-600 ${compact ? 'text-xs' : 'text-xs'}`}
              >
                {profile.age && (
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' aria-hidden='true' />
                    <span>{profile.age}歳</span>
                  </div>
                )}
                {profile.location && (
                  <div className='flex items-center gap-1'>
                    <MapPin className='w-3 h-3' aria-hidden='true' />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.tag && (
                  <div className='flex items-center gap-1'>
                    <Tag className='w-3 h-3' aria-hidden='true' />
                    <span className='px-2 py-1 bg-blue-100 text-blue-700 rounded-full'>
                      {profile.tag.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {showBookmark && <BookmarkButton targetUserId={user.id} size={compact ? 'sm' : 'sm'} />}
          </div>
        </CardHeader>
        <CardContent className={compact ? 'p-2' : ''}>
          <div className='space-y-2'>
            <div className='text-gray-700'>
              {profile?.bio ? (
                <p className='mb-1'>{profile.bio}</p>
              ) : (
                <p className='mb-1'>
                  こんにちは！私は{user.name}です！ハッカソンに一緒に出てくれる仲間を探しています！
                </p>
              )}
            </div>

            <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'} space-y-1`}>
              <p>登録日: {formatDate(user.created_at)}</p>
              {user.updated_at && user.updated_at !== user.created_at && (
                <p>更新日: {formatDate(user.updated_at)}</p>
              )}
              {profile?.updated_at && <p>プロフィール更新: {formatDate(profile.updated_at)}</p>}
            </div>

            {onUserClick && (
              <Button
                variant='outline'
                className='w-full'
                onClick={() => onUserClick(user)}
                size={compact ? 'sm' : 'default'}
              >
                詳細を見る
              </Button>
            )}
          </div>
          {children}
        </CardContent>
      </Card>
    )
  }
)

UserCard.displayName = 'UserCard'

export default UserCard
