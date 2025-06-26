'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { User, Hackathon } from './types'
import HackathonSection from './HackathonSection'

interface ProfileCardProps {
  user: User
  isFavorite: boolean
  onToggleFavorite: () => void
  hackathons: Hackathon[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

export default function ProfileCard({
  user,
  isFavorite,
  onToggleFavorite,
  hackathons,
  loading,
  error,
  onRetry,
}: ProfileCardProps) {
  return (
    <Card className='relative'>
      <Button
        size='icon'
        variant='ghost'
        className='absolute top-3 right-3 z-10'
        aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り'}
        title={isFavorite ? 'お気に入り解除' : 'お気に入り'}
        onClick={onToggleFavorite}
      >
        <Star
          className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </Button>
      <CardHeader className='flex flex-row items-center gap-4'>
        <Avatar className='w-16 h-16'>
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <CardTitle>{user.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className='mb-4 text-gray-700'>{user.intro}</p>
        <div className='mb-4'>
          <h3 className='font-semibold mb-1'>主要スキル</h3>
          <ul className='list-disc list-inside text-sm text-gray-700'>
            {user.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className='mb-4'>
          <h3 className='font-semibold mb-1'>過去のプロジェクト</h3>
          <div className='flex gap-4'>
            {user.projects.map((project, i) => (
              <a key={i} href={project.url} className='text-blue-600 hover:underline'>
                {project.label}
              </a>
            ))}
          </div>
        </div>

        <HackathonSection
          hackathons={hackathons}
          loading={loading}
          error={error}
          onRetry={onRetry}
          title='現在の自分の募集'
        />
      </CardContent>
    </Card>
  )
}
