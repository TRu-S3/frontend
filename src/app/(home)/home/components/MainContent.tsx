'use client'

import { useState, useEffect, useCallback } from 'react'
// import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Star, ChevronLeft, ChevronRight, Users, Loader2 } from 'lucide-react'

// 型定義
interface Hackathon {
  id: string
  title: string
  status: string
  desc: string
  deadline: string
  remainingDays: number
  currentMembers: number
  maxMembers: number
  avatar: string
  avatarFallback: string
}

interface User {
  id: string
  name: string
  skills: string[]
  intro: string
  projects: { label: string; url: string }[]
  hackathons: Hackathon[]
}

interface HackathonCache {
  [userId: string]: {
    data: Hackathon[]
    timestamp: number
  }
}

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
          {/* プロフィールカード */}
          <div className='flex items-center justify-center gap-4 mt-6'>
            <Button size='icon' variant='ghost' onClick={handlePrev}>
              <ChevronLeft />
            </Button>
            <Card className='relative'>
              <Button
                size='icon'
                variant='ghost'
                className='absolute top-3 right-3 z-10'
                aria-label={favoriteUsers[currentUser] ? 'お気に入り解除' : 'お気に入り'}
                title={favoriteUsers[currentUser] ? 'お気に入り解除' : 'お気に入り'}
                onClick={() => handleToggleFavorite(currentUser)}
              >
                <Star
                  className={`w-5 h-5 ${favoriteUsers[currentUser] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                  fill={favoriteUsers[currentUser] ? 'currentColor' : 'none'}
                />
              </Button>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>手</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <CardTitle>{user.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-gray-700'>{user.intro}</p>
                <div className='mb-4'>
                  <h3 className='font-semibold mb-1'>主要スキル</h3>
                  <ul className='list-disc list-inside text-sm text-gray-700'>
                    {user.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className='mb-4'>
                  <h3 className='font-semibold mb-1'>過去のプロジェクト</h3>
                  <div className='flex gap-4'>
                    {user.projects.map((p, i) => (
                      <a key={i} href={p.url} className='text-blue-600 hover:underline'>
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* ハッカソン募集セクション */}
                <div className='space-y-3'>
                  <h3 className='font-semibold mb-3'>あなたへのおすすめ募集</h3>

                  {loading && (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
                      <span className='ml-2 text-gray-600'>募集情報を読み込み中...</span>
                    </div>
                  )}

                  {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                      <p className='text-red-600 text-sm'>エラーが発生しました: {error}</p>
                      <Button
                        size='sm'
                        variant='outline'
                        className='mt-2'
                        onClick={() => getUserHackathons(user.id)}
                      >
                        再試行
                      </Button>
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    userHackathons.length > 0 &&
                    userHackathons.map((hackathon) => (
                      <Card
                        key={hackathon.id}
                        className='mb-2 hover:shadow-md transition-shadow duration-200'
                      >
                        <CardContent className='flex flex-col gap-3 pt-4'>
                          <div className='font-bold text-md mb-1 text-gray-800'>
                            {hackathon.title}
                          </div>

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
                    ))}

                  {!loading && !error && userHackathons.length === 0 && (
                    <div className='text-center py-8 text-gray-500'>
                      <p>現在募集中のハッカソンはありません</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Button size='icon' variant='ghost' onClick={handleNext}>
              <ChevronRight />
            </Button>
          </div>
        </TabsContent>
        <TabsContent value='wanted'>
          {/* プロフィールカード（同じUI） */}
          <div className='flex items-center justify-center gap-4 mt-6'>
            <Button size='icon' variant='ghost' onClick={handlePrev}>
              <ChevronLeft />
            </Button>
            <Card className='relative'>
              <Button
                size='icon'
                variant='ghost'
                className='absolute top-3 right-3 z-10'
                aria-label={favoriteUsers[currentUser] ? 'お気に入り解除' : 'お気に入り'}
                title={favoriteUsers[currentUser] ? 'お気に入り解除' : 'お気に入り'}
                onClick={() => handleToggleFavorite(currentUser)}
              >
                <Star
                  className={`w-5 h-5 ${favoriteUsers[currentUser] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                  fill={favoriteUsers[currentUser] ? 'currentColor' : 'none'}
                />
              </Button>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>手</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <CardTitle>{user.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-gray-700'>{user.intro}</p>
                <div className='mb-4'>
                  <h3 className='font-semibold mb-1'>主要スキル</h3>
                  <ul className='list-disc list-inside text-sm text-gray-700'>
                    {user.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className='mb-4'>
                  <h3 className='font-semibold mb-1'>過去のプロジェクト</h3>
                  <div className='flex gap-4'>
                    {user.projects.map((p, i) => (
                      <a key={i} href={p.url} className='text-blue-600 hover:underline'>
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* ハッカソン募集セクション */}
                <div className='space-y-3'>

                  {loading && (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
                      <span className='ml-2 text-gray-600'>募集情報を読み込み中...</span>
                    </div>
                  )}

                  {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                      <p className='text-red-600 text-sm'>エラーが発生しました: {error}</p>
                      <Button
                        size='sm'
                        variant='outline'
                        className='mt-2'
                        onClick={() => getUserHackathons(user.id)}
                      >
                        再試行
                      </Button>
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    userHackathons.length > 0 &&
                    userHackathons.map((hackathon) => (
                      <Card
                        key={hackathon.id}
                        className='mb-2 hover:shadow-md transition-shadow duration-200'
                      >
                        <CardContent className='flex flex-col gap-3 pt-4'>
                          <div className='font-bold text-md mb-1 text-gray-800'>
                            {hackathon.title}
                          </div>

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
                    ))}

                  {!loading && !error && userHackathons.length === 0 && (
                    <div className='text-center py-8 text-gray-500'>
                      <p>現在募集中のハッカソンはありません</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Button size='icon' variant='ghost' onClick={handleNext}>
              <ChevronRight />
            </Button>
          </div>
        </TabsContent>
        <TabsContent value='generation'>
          {/* プロフィールカード（同じUI） */}
          <div className='flex items-center justify-center gap-4 mt-6'>
            <Button size='icon' variant='ghost' onClick={handlePrev}>
              <ChevronLeft />
            </Button>
            <Card className='relative'>
              <Button
                size='icon'
                variant='ghost'
                className='absolute top-3 right-3 z-10'
                aria-label={favoriteUsers[currentUser] ? 'お気に入り解除' : 'お気に入り'}
                title={favoriteUsers[currentUser] ? 'お気に入り解除' : 'お気に入り'}
                onClick={() => handleToggleFavorite(currentUser)}
              >
                <Star
                  className={`w-5 h-5 ${favoriteUsers[currentUser] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                  fill={favoriteUsers[currentUser] ? 'currentColor' : 'none'}
                />
              </Button>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>手</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <CardTitle>{user.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-gray-700'>{user.intro}</p>
                <div className='mb-4'>
                  <h3 className='font-semibold mb-1'>主要スキル</h3>
                  <ul className='list-disc list-inside text-sm text-gray-700'>
                    {user.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className='mb-4'>
                  <h3 className='font-semibold mb-1'>過去のプロジェクト</h3>
                  <div className='flex gap-4'>
                    {user.projects.map((p, i) => (
                      <a key={i} href={p.url} className='text-blue-600 hover:underline'>
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* ハッカソン募集セクション */}
                <div className='space-y-3'>
                  <h3 className='font-semibold mb-3'>あなたへのおすすめ募集</h3>

                  {loading && (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
                      <span className='ml-2 text-gray-600'>募集情報を読み込み中...</span>
                    </div>
                  )}

                  {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                      <p className='text-red-600 text-sm'>エラーが発生しました: {error}</p>
                      <Button
                        size='sm'
                        variant='outline'
                        className='mt-2'
                        onClick={() => getUserHackathons(user.id)}
                      >
                        再試行
                      </Button>
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    userHackathons.length > 0 &&
                    userHackathons.map((hackathon) => (
                      <Card
                        key={hackathon.id}
                        className='mb-2 hover:shadow-md transition-shadow duration-200'
                      >
                        <CardContent className='flex flex-col gap-3 pt-4'>
                          <div className='font-bold text-md mb-1 text-gray-800'>
                            {hackathon.title}
                          </div>

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
                    ))}

                  {!loading && !error && userHackathons.length === 0 && (
                    <div className='text-center py-8 text-gray-500'>
                      <p>現在募集中のハッカソンはありません</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Button size='icon' variant='ghost' onClick={handleNext}>
              <ChevronRight />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      {/* カレンダー */}
      {/* <CalendarSection /> */}
    </section>
  )
}
