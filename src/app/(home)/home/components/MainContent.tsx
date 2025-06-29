'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import UserCard from '@/components/user/UserCard'
import { useUserContests } from '@/hooks/useUserContests'
import UserContestsList from './UserContestsList'

export default function MainContent() {
  const { user: currentUser, loading: currentUserLoading } = useCurrentUser()
  const {
    users,
    loading: usersLoading,
    error,
  } = useUsers({ autoFetch: true, filters: { limit: 20 } })
  const [currentIndex, setCurrentIndex] = useState(0)

  const loading = currentUserLoading || usersLoading
  const otherUsers = users.filter((user) => user.id !== currentUser?.id)
  const currentDisplayUser = otherUsers[currentIndex]
  const userContests = useUserContests(currentDisplayUser?.id)

  // レンダリング時にもmyContestsを出力
  console.log('myContests:', userContests)

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
        </TabsList>
        <TabsContent value='similar'>
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
                  <UserContestsList contests={userContests} />
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
