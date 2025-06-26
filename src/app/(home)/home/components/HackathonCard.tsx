'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { Hackathon } from './types'

interface HackathonCardProps {
  hackathon: Hackathon
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <Card className='mb-2 hover:shadow-md transition-shadow duration-200'>
      <CardContent className='flex flex-col gap-3 pt-4'>
        <div className='font-bold text-md mb-1 text-gray-800'>{hackathon.title}</div>

        <div className='flex items-start gap-3 mb-3'>
          <Avatar className='w-10 h-10'>
            <AvatarImage src={hackathon.avatar} alt={hackathon.title} />
            <AvatarFallback>{hackathon.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            {/* ユーザーコメント */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 relative'>
              <div className='text-sm text-gray-800 font-medium'>
                {hackathon.status.split(' / ')[0]}
              </div>
            </div>

            {/* 募集人数と残り情報 */}
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-1 text-xs text-gray-600'>
                <Users className='w-3 h-3' />
                <span>
                  {hackathon.currentMembers}/{hackathon.maxMembers}名確定
                </span>
              </div>
              <div className='text-xs font-medium text-orange-600'>
                残り{hackathon.maxMembers - hackathon.currentMembers}名
              </div>
            </div>

            <div className='flex items-center gap-2 text-xs text-gray-600'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>募集中（締切：{hackathon.deadline}）</span>
            </div>
          </div>
        </div>
        <Button
          size='sm'
          className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium'
        >
          詳細を見る（残り{hackathon.remainingDays}日）
        </Button>
      </CardContent>
    </Card>
  )
}
