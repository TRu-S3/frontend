'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { User, Hackathon } from './types'
import ProfileCard from './ProfileCard'

interface ProfileCardContainerProps {
  user: User
  isFavorite: boolean
  onToggleFavorite: () => void
  onPrev: () => void
  onNext: () => void
  hackathons: Hackathon[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

export default function ProfileCardContainer({
  user,
  isFavorite,
  onToggleFavorite,
  onPrev,
  onNext,
  hackathons,
  loading,
  error,
  onRetry,
}: ProfileCardContainerProps) {
  return (
    <div className='flex items-center justify-center gap-4 mt-6'>
      <Button size='icon' variant='ghost' onClick={onPrev}>
        <ChevronLeft />
      </Button>
      <ProfileCard
        user={user}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        hackathons={hackathons}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />
      <Button size='icon' variant='ghost' onClick={onNext}>
        <ChevronRight />
      </Button>
    </div>
  )
}
