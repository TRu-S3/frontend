'use client'

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const users = [
  {
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
    hackathon: {
      title: 'Zenn AI Agent Hackathon',
      status: 'ハッカソン、でませんか？ / 2/3名確定',
      desc: 'この人は、マネージメント経験があります。新しい技術に対して意欲的であなたと性格的にマッチすると思います',
    },
  },
  {
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
    hackathon: {
      title: 'Sample Hackathon',
      status: '一緒に参加しませんか？ / 1/3名確定',
      desc: 'バックエンドが得意です。新しいことに挑戦したいです。',
    },
  },
]

export default function MainContent() {
  const [currentUser, setCurrentUser] = useState(0)
  const user = users[currentUser]

  const handlePrev = () => setCurrentUser((prev) => (prev - 1 + users.length) % users.length)
  const handleNext = () => setCurrentUser((prev) => (prev + 1) % users.length)

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
            <Card>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>手</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <CardTitle>{user.name}</CardTitle>
                  <div className='flex items-center gap-2 mt-1'>
                    <Star className='w-5 h-5 text-yellow-400' />
                    <MoreHorizontal className='w-5 h-5 text-gray-400' />
                  </div>
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
                <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                  <div className='font-bold mb-1'>募集中のハッカソン</div>
                  <div className='text-sm mb-1'>{user.hackathon.title}</div>
                  <div className='text-xs text-gray-500 mb-2'>{user.hackathon.status}</div>
                  <div className='text-xs text-gray-700'>{user.hackathon.desc}</div>
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
            <Card>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>手</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <CardTitle>{user.name}</CardTitle>
                  <div className='flex items-center gap-2 mt-1'>
                    <Star className='w-5 h-5 text-yellow-400' />
                    <MoreHorizontal className='w-5 h-5 text-gray-400' />
                  </div>
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
                <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                  <div className='font-bold mb-1'>募集中のハッカソン</div>
                  <div className='text-sm mb-1'>{user.hackathon.title}</div>
                  <div className='text-xs text-gray-500 mb-2'>{user.hackathon.status}</div>
                  <div className='text-xs text-gray-700'>{user.hackathon.desc}</div>
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
            <Card>
              <CardHeader className='flex flex-row items-center gap-4'>
                <Avatar className='w-16 h-16'>
                  <AvatarFallback>手</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <CardTitle>{user.name}</CardTitle>
                  <div className='flex items-center gap-2 mt-1'>
                    <Star className='w-5 h-5 text-yellow-400' />
                    <MoreHorizontal className='w-5 h-5 text-gray-400' />
                  </div>
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
                <div className='bg-gray-50 rounded-lg p-4 mt-4'>
                  <div className='font-bold mb-1'>募集中のハッカソン</div>
                  <div className='text-sm mb-1'>{user.hackathon.title}</div>
                  <div className='text-xs text-gray-500 mb-2'>{user.hackathon.status}</div>
                  <div className='text-xs text-gray-700'>{user.hackathon.desc}</div>
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
