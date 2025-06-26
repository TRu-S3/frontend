'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Hackathon } from './types'
import HackathonCard from './HackathonCard'

interface HackathonSectionProps {
  hackathons: Hackathon[]
  loading: boolean
  error: string | null
  onRetry: () => void
  title?: string
}

export default function HackathonSection({
  hackathons,
  loading,
  error,
  onRetry,
  title = 'あなたへのおすすめ募集',
}: HackathonSectionProps) {
  return (
    <div className='space-y-3'>
      <h3 className='font-semibold mb-3'>{title}</h3>

      {loading && (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
          <span className='ml-2 text-gray-600'>募集情報を読み込み中...</span>
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600 text-sm'>エラーが発生しました: {error}</p>
          <Button size='sm' variant='outline' className='mt-2' onClick={onRetry}>
            再試行
          </Button>
        </div>
      )}

      {!loading &&
        !error &&
        hackathons.length > 0 &&
        hackathons.map((hackathon) => <HackathonCard key={hackathon.id} hackathon={hackathon} />)}

      {!loading && !error && hackathons.length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          <p>現在募集中のハッカソンはありません</p>
        </div>
      )}
    </div>
  )
}
