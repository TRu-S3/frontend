'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import Image from 'next/image'
import { useOGP } from '@/hooks/useOGP'
import { useEffect, useState } from 'react'

interface RecommendedHackathonCardProps {
  name: string
  bannerUrl: string
  description: string
  participants: number
  status: string
  hackathonUrl?: string
  onDetailClick?: () => void
  onTeamSearchClick?: () => void
}

export default function RecommendedHackathonCard({
  name,
  bannerUrl,
  description,
  participants,
  status,
  hackathonUrl,
  onDetailClick,
  onTeamSearchClick,
}: RecommendedHackathonCardProps) {
  const { ogpData, loading, fetchOGP } = useOGP()
  const [imageError, setImageError] = useState(false)

  // ハッカソンURLがある場合、OGPデータを取得
  useEffect(() => {
    if (hackathonUrl) {
      fetchOGP(hackathonUrl)
    }
  }, [hackathonUrl, fetchOGP])

  // OGP画像がある場合はそれを使用、なければデフォルトのbannerUrlを使用
  const imageUrl = ogpData?.image || bannerUrl
  const showFallback = !imageUrl || imageError

  return (
    <Card className='hover:shadow-lg transition-all duration-200'>
      <CardContent>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center'>
            <span className='text-white text-sm font-bold'>Z</span>
          </div>
          <div className='font-semibold text-sm text-gray-800'>{name}</div>
        </div>
        {/* ハッカソン画像 or 代替表示 */}
        <div className='mb-3 relative w-full h-32'>
          {loading ? (
            <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center'>
              <span className='text-gray-500 text-sm'>画像読み込み中...</span>
            </div>
          ) : showFallback ? (
            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg border-2'>
              <span className='text-lg md:text-2xl font-bold text-blue-700 text-center break-words px-2'>{name}</span>
            </div>
          ) : (
            <Image
              key={imageUrl}
              src={imageUrl}
              alt={name}
              className='w-full h-32 object-cover rounded-lg border-2'
              width={800}
              height={100}
              onError={() => setImageError(true)}
              priority={false}
            />
          )}
        </div>
        <div className='text-xs text-gray-600 leading-relaxed'>
          {description}
        </div>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <Users className='w-3 h-3' />
            <span>参加者: {participants}名</span>
          </div>
          <div className='text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full'>
            {status}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Button
            size='sm'
            className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200'
            onClick={onDetailClick}
          >
            詳細を見る
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200'
            onClick={onTeamSearchClick}
          >
            このハッカソンでチームを探す
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 