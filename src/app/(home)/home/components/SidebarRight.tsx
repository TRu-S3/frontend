'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, Star, Plus, Mail, Users } from 'lucide-react'
import Image from 'next/image'
import MatchingPopup from './MatchingPopup'
import React, { useState } from 'react'
import HackathonCard from './HackathonCard'
import { Hackathon } from './types'

// HackathonInfo型（MatchingPopup用）
const recommendedHackathonInfos = [
  {
    name: 'Zenn AI Agent Hackathon',
    url: 'https://static.zenn.studio/permanent/hackathon/google-cloud-japan-ai-hackathon-vol2/header_v2.png',
  },
  // 必要に応じて追加
]

export default function SidebarRight() {
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedHackathon, setSelectedHackathon] = useState<string | undefined>(undefined)

  // HackathonCard用のデータ
  const recommendedHackathons: Hackathon[] = [
    {
      id: 'hackathon1',
      title: 'Zenn AI Agent Hackathon',
      status: 'ハッカソン、でませんか？ / 2/3名確定',
      desc: 'この人は、マネージメント経験があります。新しい技術に対して意欲的であなたと性格的にマッチすると思います',
      deadline: '1/10',
      remainingDays: 2,
      currentMembers: 2,
      maxMembers: 3,
      avatar: '/AI.webp',
      avatarFallback: 'Z',
    },
    // 今後ここに追加可能
  ]

  return (
    <aside className='hidden lg:flex flex-col border-l bg-gradient-to-b from-white/80 to-slate-50/80 backdrop-blur-sm h-full border-white/30'>
      <div className='p-6 border-b flex flex-col gap-3'>
        <Button variant='outline' className='w-full flex items-center gap-2 justify-center'>
          <Mail className='w-5 h-5' />
          DM
        </Button>
        <Button variant='outline' className='w-full flex items-center gap-2 justify-center'>
          <Bell className='w-5 h-5' />
          通知
        </Button>
        <Button variant='outline' className='w-full flex items-center gap-2 justify-center'>
          <Star className='w-5 h-5 text-yellow-400' />
          ブックマーク
        </Button>
      </div>
      <div className='p-6 border-b'>
        <div className='flex items-center justify-between mb-3'>
          <span className='font-bold'>あなたへのおすすめ募集</span>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setSelectedHackathon(undefined)
              setPopupOpen(true)
            }}
          >
            <Plus className='w-5 h-5 text-gray-400' />
          </Button>
        </div>
        {/* HackathonCardで表示 */}
        {recommendedHackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
        ))}
      </div>
      <div className='p-6'>
        <div className='flex items-center gap-3 mb-3'>
          <div>
            <div className='font-bold text-gray-800'>AIおすすめイベント</div>
          </div>
        </div>

        <Card className='hover:shadow-lg transition-all duration-200'>
          <CardContent className=''>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center'>
                <span className='text-white text-sm font-bold'>Z</span>
              </div>
              <div className='font-semibold text-sm text-gray-800'>Zenn AI Agent Hackathon</div>
            </div>

            {/* ハッカソン画像 */}
            <div className='mb-3'>
              <Image
                src='https://static.zenn.studio/permanent/hackathon/google-cloud-japan-ai-hackathon-vol2/header_v2.png'
                alt='AI Agent Hackathon'
                className='w-full h-32 object-cover rounded-lg border-2'
                width={800}
                height={100}
              />
            </div>

            <div className='text-xs text-gray-600 leading-relaxed'>
              AIエージェント開発に特化したハッカソンです。
              <br />
              最新のAI技術を学びながら、革新的なプロダクトを作りませんか？
            </div>

            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2 text-xs text-gray-600'>
                <Users className='w-3 h-3' />
                <span>参加者: 150名</span>
              </div>
              <div className='text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full'>
                募集中
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Button
                size='sm'
                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200'
              >
                詳細を見る
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200'
                onClick={() => {
                  setPopupOpen(false)
                  setTimeout(() => {
                    setSelectedHackathon('Zenn AI Agent Hackathon')
                    setPopupOpen(true)
                  }, 0)
                }}
              >
                このハッカソンでチームを探す
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <MatchingPopup
        trigger={<></>}
        open={popupOpen}
        onOpenChange={setPopupOpen}
        initialHackathonName={selectedHackathon}
        recommendedHackathons={recommendedHackathonInfos}
      />
    </aside>
  )
}
