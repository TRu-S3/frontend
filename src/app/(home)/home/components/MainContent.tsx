'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import UserCard from '@/components/user/UserCard'
import { contestsApi, Contest } from '@/lib/api/contests'
import RecruitingHackathonCard from './RecruitingHackathonCard'

export default function MainContent() {
  const { user: currentUser, loading: currentUserLoading } = useCurrentUser()
  const {
    users,
    loading: usersLoading,
    error,
  } = useUsers({ autoFetch: true, filters: { limit: 20 } })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [myContests, setMyContests] = useState<Contest[]>([])
  const [userContests, setUserContests] = useState<Contest[]>([])
  const [showAllContests, setShowAllContests] = useState(false)

  const loading = currentUserLoading || usersLoading

  // 自分以外のユーザーをフィルタリング
  const otherUsers = users.filter((user) => user.id !== currentUser?.id)
  const currentDisplayUser = otherUsers[currentIndex]

  useEffect(() => {
    if (!currentUser) return
    console.log('currentUser:', currentUser)
    contestsApi.list({ author_id: currentUser.id }).then((res) => {
      console.log('自分の募集:', res.contests)
      setMyContests(res.contests || [])
    })
  }, [currentUser])

  useEffect(() => {
    if (!currentDisplayUser) return
    contestsApi.list({ author_id: currentDisplayUser.id }).then((res) => {
      setUserContests(res.contests || [])
      setShowAllContests(false) // 取得後にリセット
      console.log('userContests取得:', res.contests)
    })
  }, [currentDisplayUser])

  // レンダリング時にもmyContestsを出力
  console.log('myContests:', myContests)

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + otherUsers.length) % otherUsers.length)
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % otherUsers.length)

  // ローディング状態
  if (loading) {
    return (
      <section className='flex flex-col items-center px-2 py-6 gap-6'>
        <div className='flex items-center gap-2'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>ユーザーを読み込み中...</span>
        </div>
      </section>
    )
  }

  // エラー状態
  if (error) {
    return (
      <section className='flex flex-col items-center px-2 py-6 gap-6'>
        <div className='text-center'>
          <div className='text-red-500 mb-2'>{error}</div>
          <Button onClick={() => window.location.reload()}>再読み込み</Button>
        </div>
      </section>
    )
  }

  // ユーザーがいない場合
  if (otherUsers.length === 0) {
    return (
      <section className='flex flex-col items-center px-2 py-6 gap-6'>
        <div className='text-center py-16'>
          <h2 className='text-xl font-semibold text-gray-600 mb-2'>表示するユーザーがいません</h2>
          <p className='text-gray-500'>他のユーザーが登録されると、ここに表示されます。</p>
        </div>
      </section>
    )
  }

  return (
    <section className='flex flex-col items-center px-2 py-6 gap-6'>
      <Tabs defaultValue='similar' className='w-full max-w-2xl'>
        <TabsList className='w-full flex'>
          <TabsTrigger value='similar' className='flex-1'>
            似ているユーザー
          </TabsTrigger>
          <TabsTrigger value='wanted' className='flex-1'>
            求めているユーザー
          </TabsTrigger>
          <TabsTrigger value='generation' className='flex-1'>
            同世代のユーザー
          </TabsTrigger>
        </TabsList>
        <TabsContent value='similar'>
          {/* プロフィールカード＋そのユーザーの募集 */}
          <div className='flex items-center justify-center gap-4 mt-6'>
            <Button
              size='icon'
              variant='ghost'
              onClick={handlePrev}
              disabled={otherUsers.length <= 1}
            >
              <ChevronLeft />
            </Button>
            <div className='w-full max-w-md'>
              {currentDisplayUser && (
                <UserCard user={currentDisplayUser} showBookmark={true}>
                  {/* そのユーザーの募集を縦並びで表示（2件まで、3件以上はもっと見る） */}
                  {userContests.length > 0 && (
                    <div className='mt-6 space-y-4 relative max-h-[500px] overflow-hidden'>
                      <div className='font-bold text-gray-700 mb-2'>このユーザーの募集</div>
                      {(showAllContests ? userContests : userContests.slice(0, 2)).map(
                        (contest) => (
                          <RecruitingHackathonCard
                            key={contest.id}
                            name={contest.title || 'ハッカソン名'}
                            registrationDeadline={contest.application_deadline}
                            message={contest.message}
                            websiteUrl={contest.website_url}
                            backend_quota={contest.backend_quota}
                            frontend_quota={contest.frontend_quota}
                            ai_quota={contest.ai_quota}
                          />
                        )
                      )}
                      {userContests.length > 2 && !showAllContests && (
                        <>
                          <div className='absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none'></div>
                          <button
                            onClick={() => setShowAllContests(true)}
                            className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-xs bg-white border rounded px-4 py-2 shadow hover:bg-gray-100 cursor-pointer'
                          >
                            もっと見る
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </UserCard>
              )}
            </div>
            <Button
              size='icon'
              variant='ghost'
              onClick={handleNext}
              disabled={otherUsers.length <= 1}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className='text-center text-sm text-gray-500 mt-4'>
            {currentIndex + 1} / {otherUsers.length}
          </div>
        </TabsContent>
        <TabsContent value='wanted'>
          <div className='flex items-center justify-center gap-4 mt-6'>
            <Button
              size='icon'
              variant='ghost'
              onClick={handlePrev}
              disabled={otherUsers.length <= 1}
            >
              <ChevronLeft />
            </Button>
            <div className='w-full max-w-md'>
              {currentDisplayUser && <UserCard user={currentDisplayUser} showBookmark={true} />}
            </div>
            <Button
              size='icon'
              variant='ghost'
              onClick={handleNext}
              disabled={otherUsers.length <= 1}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className='text-center text-sm text-gray-500 mt-4'>
            {currentIndex + 1} / {otherUsers.length}
          </div>
        </TabsContent>
        <TabsContent value='generation'>
          <div className='flex items-center justify-center gap-4 mt-6'>
            <Button
              size='icon'
              variant='ghost'
              onClick={handlePrev}
              disabled={otherUsers.length <= 1}
            >
              <ChevronLeft />
            </Button>
            <div className='w-full max-w-md'>
              {currentDisplayUser && <UserCard user={currentDisplayUser} showBookmark={true} />}
            </div>
            <Button
              size='icon'
              variant='ghost'
              onClick={handleNext}
              disabled={otherUsers.length <= 1}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className='text-center text-sm text-gray-500 mt-4'>
            {currentIndex + 1} / {otherUsers.length}
          </div>
        </TabsContent>
      </Tabs>
      {/* カレンダー */}
      {/* <CalendarSection /> */}
    </section>
  )
}
