'use client'

import { useState, useEffect, useCallback } from 'react'
// import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { User, Hackathon, HackathonCache } from './types'
import ProfileCardContainer from './ProfileCardContainer'

const users: User[] = [
  {
    id: 'user1',
    name: '手羽太郎',
    skills: [
      'ハッカソン出場回数: 5回',
      '得意な役割: フロントエンド開発, UI/UXデザイン',
      '挑戦したい役割: バックエンド開発, インフラ構築',
    ],
    intro:
      'こんにちは！私は手羽太郎です！ハッカソンに一緒に出てくれる仲間を探しています！ぜひ、ZennのAIエージェントハッカソンに一緒に出ましょう！優勝目指すぞ！',
    projects: [
      { label: '技術ブログ', url: '#' },
      { label: 'GitHub', url: '#' },
    ],
    hackathons: [
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
    ],
  },
  {
    id: 'user2',
    name: 'サンプル太郎',
    skills: [
      'ハッカソン出場回数: 2回',
      '得意な役割: バックエンド開発',
      '挑戦したい役割: フロントエンド開発',
    ],
    intro: 'こんにちは！私はサンプル太郎です！新しい仲間を探しています！',
    projects: [
      { label: 'Qiita', url: '#' },
      { label: 'Portfolio', url: '#' },
    ],
    hackathons: [
      {
        id: 'hackathon2',
        title: 'Sample Hackathon',
        status: '一緒に参加しませんか？ / 1/3名確定',
        desc: 'バックエンドが得意です。新しいことに挑戦したいです。',
        deadline: '1/15',
        remainingDays: 7,
        currentMembers: 1,
        maxMembers: 3,
        avatar: '/AI.webp',
        avatarFallback: 'S',
      },
    ],
  },
]

// API関数
const fetchUserHackathons = async (userId: string): Promise<Hackathon[]> => {
  // 実際の実装では、APIから取得
  // const response = await fetch(`/api/users/${userId}/hackathons`)
  // if (!response.ok) throw new Error('Failed to fetch hackathons')
  // return response.json()

  // 現在はモックデータを返す（非同期をシミュレート）
  await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms遅延
  const user = users.find((u) => u.id === userId)
  return user?.hackathons || []
}

export default function MainContent() {
  const [currentUser, setCurrentUser] = useState(0)
  const [favoriteUsers, setFavoriteUsers] = useState<boolean[]>(users.map(() => false))
  const [userHackathons, setUserHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hackathonCache, setHackathonCache] = useState<HackathonCache>({})

  const user = users[currentUser]

  const handlePrev = () => setCurrentUser((prev) => (prev - 1 + users.length) % users.length)
  const handleNext = () => setCurrentUser((prev) => (prev + 1) % users.length)

  const handleToggleFavorite = (index: number) => {
    setFavoriteUsers((favs) => favs.map((f, i) => (i === index ? !f : f)))
  }

  // バックエンドから取得する関数（非同期対応）
  const getUserHackathons = useCallback(
    async (userId: string): Promise<Hackathon[]> => {
      const CACHE_DURATION = 5 * 60 * 1000 // 5分間キャッシュ

      // キャッシュチェック
      const cached = hackathonCache[userId]
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
      }

      setLoading(true)
      setError(null)

      try {
        const hackathons = await fetchUserHackathons(userId)

        // キャッシュに保存
        setHackathonCache((prev) => ({
          ...prev,
          [userId]: {
            data: hackathons,
            timestamp: Date.now(),
          },
        }))

        return hackathons
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        return []
      } finally {
        setLoading(false)
      }
    },
    [hackathonCache]
  )

  // ユーザーが変更されたときにハッカソンデータを取得
  useEffect(() => {
    const fetchHackathons = async () => {
      const hackathons = await getUserHackathons(user.id)
      setUserHackathons(hackathons)
    }

    fetchHackathons()
  }, [user.id, getUserHackathons])

  // TanStack Queryを使用したデータフェッチング（コメントアウト）
  /*
  const {
    data: userHackathons = [],
    isLoading,
    error,
    refetch
  } = useQuery<Hackathon[]>({
    queryKey: ['userHackathons', user.id],
    queryFn: () => fetchUserHackathons(user.id),
    staleTime: 5 * 60 * 1000, // 5分間は新鮮とみなす
    gcTime: 10 * 60 * 1000, // 10分間キャッシュ
    retry: 2, // エラー時に2回リトライ
  })
  */

  const handleRetry = () => {
    getUserHackathons(user.id)
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
          <ProfileCardContainer
            user={user}
            isFavorite={favoriteUsers[currentUser]}
            onToggleFavorite={() => handleToggleFavorite(currentUser)}
            onPrev={handlePrev}
            onNext={handleNext}
            hackathons={userHackathons}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </TabsContent>

        <TabsContent value='wanted'>
          <ProfileCardContainer
            user={user}
            isFavorite={favoriteUsers[currentUser]}
            onToggleFavorite={() => handleToggleFavorite(currentUser)}
            onPrev={handlePrev}
            onNext={handleNext}
            hackathons={userHackathons}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </TabsContent>

        <TabsContent value='generation'>
          <ProfileCardContainer
            user={user}
            isFavorite={favoriteUsers[currentUser]}
            onToggleFavorite={() => handleToggleFavorite(currentUser)}
            onPrev={handlePrev}
            onNext={handleNext}
            hackathons={userHackathons}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </TabsContent>
      </Tabs>
      {/* カレンダー */}
      {/* <CalendarSection /> */}
    </section>
  )
}
