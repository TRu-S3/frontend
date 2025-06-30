import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, Tag } from 'lucide-react'
import { User as BackendUser } from '@/lib/api/users'
import { useProfile } from '@/hooks/useProfile'
import React from 'react'

interface ChatUserCardProps {
  user: BackendUser
  onClick?: (userId: number) => void
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export const ChatUserCard: React.FC<ChatUserCardProps> = ({ user, onClick }) => {
  const { profile } = useProfile({ userId: user.id })

  return (
    <div
      className='max-w-[220px] p-2 border rounded-lg bg-white flex flex-col gap-1 text-xs shadow-sm cursor-pointer hover:bg-blue-50 transition'
      onClick={() => onClick?.(user.id)}
    >
      <div className='flex items-center gap-2'>
        <Avatar className='w-8 h-8'>
          {user.icon_url ? (
            <AvatarImage src={user.icon_url} alt={`${user.name}のプロフィール画像`} />
          ) : (
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
              {getInitials(user.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className='flex-1 min-w-0'>
          <div className='font-bold truncate'>
            {user.name}
            {profile?.age && ` (${profile.age}歳)`}
          </div>
          <div className='flex gap-1 text-gray-500 items-center'>
            {profile?.location && (
              <span className='flex items-center gap-0.5'>
                <MapPin className='w-3 h-3' />
                {profile.location}
              </span>
            )}
            {profile?.tag && (
              <span className='bg-blue-100 text-blue-700 rounded px-1 flex items-center gap-0.5'>
                <Tag className='w-3 h-3' />
                {profile.tag.name}
              </span>
            )}
          </div>
        </div>
      </div>
      {profile?.bio && (
        <div className='text-gray-700 mt-1 line-clamp-2 break-words'>{profile.bio}</div>
      )}
    </div>
  )
}

export default ChatUserCard
