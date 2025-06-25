'use client'

import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { Heart, Github, User, Star, BookmarkX } from 'lucide-react'

interface BookmarkedUser {
  id: string
  name: string
  bio: string
  avatar?: string
  skills: string[]
  hackathonCount: number
  contributions: number
  repositories: number
  languages: string[]
  location?: string
  githubUrl?: string
  addedAt: Date
}

interface BookmarkClientProps {
  initialBookmarkedUsers: BookmarkedUser[]
}

export const BookmarkClient = ({ initialBookmarkedUsers }: BookmarkClientProps) => {
  const [bookmarkedUsers, setBookmarkedUsers] = useState<BookmarkedUser[]>(initialBookmarkedUsers)
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'contributions'>('recent')

  const removeBookmark = (userId: string) => {
    setBookmarkedUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const sortedUsers = [...bookmarkedUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'contributions':
        return b.contributions - a.contributions
      case 'recent':
      default:
        return b.addedAt.getTime() - a.addedAt.getTime()
    }
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* ヘッダー */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Heart className='w-6 h-6 text-red-500 fill-current' />
              <h1 className='text-2xl font-bold text-gray-900'>ブックマーク</h1>
              <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium'>
                {bookmarkedUsers.length}人
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='sort-select' className='text-sm text-gray-500'>
                並び替え:
              </label>
              <select
                id='sort-select'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className='px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
              >
                <option value='recent'>追加日時</option>
                <option value='name'>名前</option>
                <option value='contributions'>コントリビューション数</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {bookmarkedUsers.length === 0 ? (
          <div className='text-center py-16'>
            <Heart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-600 mb-2'>
              ブックマークしたユーザーがいません
            </h2>
            <p className='text-gray-500'>
              気になるユーザーをブックマークして、ここに表示させましょう。
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {sortedUsers.map((user) => (
              <Card
                key={user.id}
                className='hover:shadow-md transition-shadow duration-200 bg-white'
              >
                <CardContent className='p-6'>
                  <div className='flex items-start gap-4'>
                    {/* アバター */}
                    <Avatar className='w-14 h-14 border-2 border-gray-100'>
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* メイン情報 */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900 mb-1'>{user.name}</h3>
                          <div className='flex items-center gap-4 text-sm text-gray-500 mb-2'>
                            {user.location && (
                              <span className='flex items-center gap-1'>
                                <User className='w-4 h-4' />
                                {user.location}
                              </span>
                            )}
                            <span className='flex items-center gap-1'>
                              <Star className='w-4 h-4' />
                              ハッカソン {user.hackathonCount}回
                            </span>
                            <span>追加: {formatDate(user.addedAt)}</span>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => removeBookmark(user.id)}
                          className='text-red-500 hover:text-red-700 hover:bg-red-50'
                        >
                          <BookmarkX className='w-4 h-4' />
                        </Button>
                      </div>

                      <p className='text-gray-700 mb-4 leading-relaxed'>{user.bio}</p>

                      {/* スキルタグ */}
                      <div className='flex flex-wrap gap-2 mb-4'>
                        {user.skills.map((skill, index) => (
                          <Tag
                            key={index}
                            variant='secondary'
                            className='bg-blue-50 text-blue-700 border-blue-200'
                          >
                            {skill}
                          </Tag>
                        ))}
                      </div>

                      {/* 統計情報 */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-6 text-sm'>
                          <div className='flex items-center gap-2'>
                            <Github className='w-4 h-4 text-gray-500' />
                            <span className='text-gray-600'>
                              <span className='font-semibold text-gray-900'>
                                {user.repositories}
                              </span>{' '}
                              リポジトリ
                            </span>
                          </div>
                          <div className='text-gray-600'>
                            <span className='font-semibold text-gray-900'>
                              {user.contributions.toLocaleString()}
                            </span>{' '}
                            コントリビューション
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='text-gray-600'>主要言語:</span>
                            <div className='flex gap-1'>
                              {user.languages.slice(0, 3).map((lang, index) => (
                                <Tag key={index} variant='outline' className='text-xs px-2 py-1'>
                                  {lang}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                        {user.githubUrl && (
                          <Button variant='outline' size='sm' asChild className='hover:bg-gray-50'>
                            <a href={user.githubUrl} target='_blank' rel='noopener noreferrer'>
                              <Github className='w-4 h-4 mr-2' />
                              GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
