import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import Image from 'next/image'

interface RecommendedHackathonCardProps {
  name: string
  bannerUrl: string
  description: string
  participants: number
  status: string
  onDetailClick?: () => void
  onTeamSearchClick?: () => void
}

export default function RecommendedHackathonCard({
  name,
  bannerUrl,
  description,
  participants,
  status,
  onDetailClick,
  onTeamSearchClick,
}: RecommendedHackathonCardProps) {
  return (
    <Card className='hover:shadow-lg transition-all duration-200'>
      <CardContent>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center'>
            <span className='text-white text-sm font-bold'>Z</span>
          </div>
          <div className='font-semibold text-sm text-gray-800'>{name}</div>
        </div>
        {/* ハッカソン画像 */}
        <div className='mb-3'>
          <Image
            src={bannerUrl}
            alt={name}
            className='w-full h-32 object-cover rounded-lg border-2'
            width={800}
            height={100}
          />
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