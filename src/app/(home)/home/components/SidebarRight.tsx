'use client'

import { Button } from '@/components/ui/button'
import { Mail, Bell, Star, Plus } from 'lucide-react'
import MatchingPopup from './MatchingPopup'
import ComingSoonPopup from '@/components/ui/ComingSoonPopup'
import ContestDetailPopup from './ContestDetailPopup'
import React, { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RecommendedHackathonCard from './RecommendedHackathonCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useHackathons } from '@/hooks/useHackathons'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import RecruitingHackathonCard from './RecruitingHackathonCard'
import { contestsApi, Contest } from '@/lib/api/contests'

export default function SidebarRight() {
  const router = useRouter()
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedHackathon, setSelectedHackathon] = useState<string | undefined>(undefined)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState('')
  const [detailPopupOpen, setDetailPopupOpen] = useState(false)
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null)
  const { hackathons, loading, error } = useHackathons()
  const { user: currentUser } = useCurrentUser()
  const [latestContests, setLatestContests] = useState<Contest[]>([])
  const [contestLoading, setContestLoading] = useState(false)
  const [contestError, setContestError] = useState<string | null>(null)

  // バックエンドのハッカソンデータをMatchingPopup用の形式に変換
  const recommendedHackathons = useMemo(() => {
    return hackathons.map((hackathon) => ({
      name: hackathon.name,
      url: hackathon.banner_url || '/default.png',
      description: hackathon.description,
    }))
  }, [hackathons])

  // 自分が投稿した募集を除外したおすすめ募集
  const filteredContests = useMemo(() => {
    if (!currentUser) return latestContests
    return latestContests.filter((contest) => contest.author_id !== currentUser.id)
  }, [latestContests, currentUser])

  const handleComingSoon = (featureName: string) => {
    setComingSoonFeature(featureName)
    setComingSoonOpen(true)
  }

  const handleDetailClick = (contest: Contest) => {
    setSelectedContest(contest)
    setDetailPopupOpen(true)
  }

  useEffect(() => {
    setContestLoading(true)
    contestsApi
      .list({ page: 1, limit: 5 })
      .then((res) => {
        console.log('API contests:', res.contests)
        setLatestContests(res.contests || [])
        setContestError(null)
      })
      .catch(() => {
        setContestError('コンテスト情報の取得に失敗しました')
      })
      .finally(() => setContestLoading(false))
  }, [])

  return (
    <aside className='hidden lg:flex flex-col border-l bg-gradient-to-b from-white/80 to-slate-50/80 backdrop-blur-sm h-full border-white/30 w-full'>
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

        {/* ハッカソン情報（カルーセル化） */}
        {contestLoading ? (
          <div className='py-8 text-center text-gray-500'>読み込み中...</div>
        ) : contestError ? (
          <div className='py-8 text-center text-red-500'>{contestError}</div>
        ) : filteredContests.length > 0 ? (
          <div className='relative w-full'>
            <Carousel className='w-full'>
              <CarouselContent>
                {filteredContests.map((contest) => {
                  const cardProps = {
                    name: contest.title || 'ハッカソン名',
                    registrationDeadline: contest.application_deadline,
                    message: contest.message,
                    websiteUrl: contest.website_url || '',
                    backend_quota: contest.backend_quota,
                    frontend_quota: contest.frontend_quota,
                    ai_quota: contest.ai_quota,
                    onDetailClick: () => handleDetailClick(contest),
                  }
                  return (
                    <CarouselItem key={contest.id} className='basis-auto p-2 flex justify-center'>
                      <div className='w-72 max-w-xs'>
                        <RecruitingHackathonCard {...cardProps} />
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2 z-10' />
              <CarouselNext className='absolute right-0 top-1/2 -translate-y-1/2 z-10' />
            </Carousel>
          </div>
        ) : (
          <div className='py-8 text-center text-gray-500'>現在募集中のハッカソンはありません</div>
        )}
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
                      hackathonUrl={hackathon.website_url}
                      onDetailClick={() => {
                        if (hackathon.website_url) {
                          window.open(hackathon.website_url, '_blank')
                        }
                      }}
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

      {/* ポップアップ */}
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

      <ContestDetailPopup
        contest={selectedContest}
        isOpen={detailPopupOpen}
        onClose={() => setDetailPopupOpen(false)}
      />
    </aside>
  )
}
