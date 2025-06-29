'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, Star, Plus, Mail, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MatchingPopup from './MatchingPopup'
import ComingSoonPopup from '@/components/ui/ComingSoonPopup'
import React, { useState } from 'react'
import RecommendedHackathonCard from './RecommendedHackathonCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useHackathons } from '@/hooks/useHackathons'
import { useRouter } from 'next/navigation'

export default function SidebarRight() {
  const router = useRouter()
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedHackathon, setSelectedHackathon] = useState<string | undefined>(undefined)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState('')
  const { hackathons, loading, error } = useHackathons()

  const recommendedHackathons = [
    {
      name: 'Zenn AI Agent Hackathon',
      url: 'https://static.zenn.studio/permanent/hackathon/google-cloud-japan-ai-hackathon-vol2/header_v2.png',
    },
    // 今後ここに追加可能
  ]

  const handleComingSoon = (featureName: string) => {
    setComingSoonFeature(featureName)
    setComingSoonOpen(true)
  }

  return (
    <aside className='hidden lg:flex flex-col border-l bg-gradient-to-b from-white/80 to-slate-50/80 backdrop-blur-sm h-full border-white/30'>
      <div className='p-6 border-b flex flex-col gap-3'>
        <Button
          variant='outline'
          className='w-full flex items-center gap-2 justify-center'
          onClick={() => handleComingSoon('DM')}
        >
          <Mail className='w-5 h-5' />
          DM
        </Button>
        <Button
          variant='outline'
          className='w-full flex items-center gap-2 justify-center'
          onClick={() => router.push('/notification')}
        >
          <Bell className='w-5 h-5' />
          通知
        </Button>
        <Button
          variant='outline'
          className='w-full flex items-center gap-2 justify-center'
          onClick={() => router.push('/bookmark')}
        >
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

        {/* ハッカソン情報 */}
        <Card className='mb-2 hover:shadow-md transition-shadow duration-200'>
          <CardContent className='flex flex-col gap-3'>
            <div className='font-bold text-md mb-1 text-gray-800'>Zenn AI Agent Hackathon</div>

            <div className='flex items-start gap-3 mb-3'>
              <Avatar className='w-10 h-10'>
                <AvatarImage src='/AI.webp' alt='AI' />
                <AvatarFallback>Z</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                {/* ユーザーコメント */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 relative'>
                  <div className='text-sm text-gray-800 font-medium'>ハッカソン、でませんか？</div>
                </div>

                {/* 募集人数と残り情報 */}
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-1 text-xs text-gray-600'>
                    <Users className='w-3 h-3' />
                    <span>2/3名確定</span>
                  </div>
                  <div className='text-xs font-medium text-orange-600'>残り1名</div>
                </div>

                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span>募集中（締切：1/10）</span>
                </div>
              </div>
            </div>
            <Button
              size='sm'
              className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium'
            >
              詳細を見る（残り2日）
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className='p-6'>
        <div className='flex items-center gap-3 mb-3'>
          <div>
            <div className='font-bold text-gray-800'>AIおすすめイベント</div>
          </div>
        </div>
        <div className='relative'>
          {loading ? (
            <div className='py-8 text-center text-gray-500'>読み込み中...</div>
          ) : error ? (
            <div className='py-8 text-center text-red-500'>{error}</div>
          ) : !hackathons.length ? (
            <div className='py-8 text-center text-gray-500'>おすすめイベントがありません</div>
          ) : (
            <Carousel className='w-full'>
              <CarouselContent>
                {hackathons.map((hackathon) => (
                  <CarouselItem
                    key={hackathon.id}
                    className='basis-1/1 md:basis-2/3 lg:basis-1/2 p-2'
                  >
                    <RecommendedHackathonCard
                      name={hackathon.name}
                      bannerUrl={hackathon.banner_url || '/default.png'}
                      description={hackathon.description}
                      participants={hackathon.max_participants}
                      status={hackathon.status === 'upcoming' ? '募集中' : hackathon.status}
                      onDetailClick={() => {}}
                      onTeamSearchClick={() => {
                        setSelectedHackathon(hackathon.name)
                        setPopupOpen(true)
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
      <MatchingPopup
        trigger={<></>}
        open={popupOpen}
        onOpenChange={setPopupOpen}
        initialHackathonName={selectedHackathon}
        recommendedHackathons={recommendedHackathons}
      />
      <ComingSoonPopup
        open={comingSoonOpen}
        onOpenChange={setComingSoonOpen}
        featureName={comingSoonFeature}
      />
    </aside>
  )
}
