import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import React from 'react'

interface RecruitingHackathonCardProps {
  name: string
  registrationDeadline?: string
  message?: string
  websiteUrl?: string
  backend_quota?: number
  frontend_quota?: number
  ai_quota?: number
  onDetailClick?: () => void
}

const formatDate = (isoString?: string) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '-'
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

const getDaysLeft = (deadline?: string) => {
  if (!deadline) return null
  const now = new Date()
  const end = new Date(deadline)
  end.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

const RecruitingHackathonCard: React.FC<RecruitingHackathonCardProps> = ({
  name,
  registrationDeadline,
  message,
  websiteUrl,
  backend_quota,
  frontend_quota,
  ai_quota,
  onDetailClick,
}) => {
  const daysLeft = getDaysLeft(registrationDeadline)

  // 締切日が過ぎている場合は表示しない
  if (daysLeft !== null && daysLeft < 0) return null

  return (
    <Card className='mb-2 hover:shadow-md transition-shadow duration-200'>
      <CardContent className='flex flex-col gap-3'>
        <div className='font-bold text-md mb-1 text-gray-800'>{name}</div>
        <div className='flex items-start gap-3 mb-3'>
          <div className='flex-1 min-w-0'>
            {/* メッセージ表示 */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 relative'>
              <div className='text-sm text-gray-800 font-medium'>{message}</div>
            </div>
            {/* 募集人数表示 */}
            <div className='mb-2'>
              {typeof frontend_quota === 'number' && frontend_quota > 0 && (
                <div className='text-xs text-gray-700'>フロントエンド: {frontend_quota}</div>
              )}
              {typeof backend_quota === 'number' && backend_quota > 0 && (
                <div className='text-xs text-gray-700'>バックエンド: {backend_quota}</div>
              )}
              {typeof ai_quota === 'number' && ai_quota > 0 && (
                <div className='text-xs text-gray-700'>AIエンジニア: {ai_quota}</div>
              )}
            </div>
            {/* 募集状況など（必要に応じて拡張） */}
            <div className='flex items-center gap-2 text-xs text-gray-600'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>募集中</span>
              <span>｜ 締切：{formatDate(registrationDeadline)}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium'
            onClick={() => {
              if (onDetailClick) {
                onDetailClick()
              } else if (websiteUrl) {
                window.open(websiteUrl, '_blank')
              }
            }}
          >
            詳細を見る
            {daysLeft !== null && daysLeft >= 0 && <span className='ml-2'>(残り{daysLeft}日)</span>}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecruitingHackathonCard
