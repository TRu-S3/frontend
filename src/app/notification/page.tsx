'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import {
  Bell,
  Calendar,
  Bot,
  Clock,
  Check,
  ExternalLink,
  Settings,
  Filter,
  CheckCheck,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'admin' | 'hackathon' | 'ai_agent'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  actionText?: string
  metadata?: {
    hackathonName?: string
    deadline?: Date
    location?: string
    tags?: string[]
  }
}

// モックデータ
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'hackathon',
    title: '新しいハッカソンが開催されます',
    message:
      'AI×Healthcare Hackathon 2024が3月15日-17日に開催されます。医療分野でのAI活用をテーマとした3日間のイベントです。参加登録は2月29日まで。',
    timestamp: new Date('2024-01-20T10:00:00'),
    isRead: false,
    actionUrl: '/hackathon/ai-healthcare-2024',
    actionText: '詳細を見る',
    metadata: {
      hackathonName: 'AI×Healthcare Hackathon 2024',
      deadline: new Date('2024-02-29'),
      location: '東京',
      tags: ['AI', 'Healthcare', '3日間'],
    },
  },
  {
    id: '2',
    type: 'ai_agent',
    title: 'チームマッチングの提案があります',
    message:
      'あなたのスキル（React, TypeScript）に基づいて、相性の良いチームメンバー候補を3名見つけました。フロントエンド開発者を探しているチームがあります。',
    timestamp: new Date('2024-01-19T15:30:00'),
    isRead: false,
    actionUrl: '/matching/suggestions',
    actionText: '候補を確認',
    metadata: {
      tags: ['チームマッチング', 'React', 'TypeScript'],
    },
  },
  {
    id: '3',
    type: 'admin',
    title: 'プラットフォームメンテナンスのお知らせ',
    message:
      '1月25日（木）2:00-4:00にシステムメンテナンスを実施いたします。この間、一部機能がご利用いただけません。ご不便をおかけして申し訳ございません。',
    timestamp: new Date('2024-01-18T12:00:00'),
    isRead: true,
    metadata: {
      tags: ['メンテナンス', 'システム'],
    },
  },
  {
    id: '4',
    type: 'hackathon',
    title: 'エントリー締切が近づいています',
    message:
      'Web3 Innovation Challenge 2024のエントリー締切まで残り3日です。ブロックチェーン技術を活用した革新的なアプリケーション開発にチャレンジしませんか？',
    timestamp: new Date('2024-01-17T09:15:00'),
    isRead: true,
    actionUrl: '/hackathon/web3-innovation-2024',
    actionText: 'エントリー',
    metadata: {
      hackathonName: 'Web3 Innovation Challenge 2024',
      deadline: new Date('2024-01-20'),
      location: 'オンライン',
      tags: ['Web3', 'ブロックチェーン', '48時間'],
    },
  },
  {
    id: '5',
    type: 'ai_agent',
    title: 'スキル分析レポートが完成しました',
    message:
      'あなたの過去のプロジェクトとコントリビューションを分析した結果、データサイエンス分野での成長ポテンシャルが高いことが判明しました。',
    timestamp: new Date('2024-01-16T14:20:00'),
    isRead: true,
    actionUrl: '/profile/skill-analysis',
    actionText: 'レポートを見る',
    metadata: {
      tags: ['スキル分析', 'データサイエンス'],
    },
  },
  {
    id: '6',
    type: 'admin',
    title: '新機能リリースのお知らせ',
    message:
      'プロフィール検索機能とチームビルディング支援ツールをリリースしました。より効率的なチーム編成が可能になります。',
    timestamp: new Date('2024-01-15T16:45:00'),
    isRead: true,
    actionUrl: '/features/team-building',
    actionText: '新機能を試す',
    metadata: {
      tags: ['新機能', 'チームビルディング', 'プロフィール検索'],
    },
  },
]

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'hackathon' | 'ai_agent'>('all')
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all')

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => {
    const typeMatch = filterType === 'all' || notif.type === filterType
    const readMatch =
      filterRead === 'all' ||
      (filterRead === 'unread' && !notif.isRead) ||
      (filterRead === 'read' && notif.isRead)
    return typeMatch && readMatch
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'admin':
        return <Settings className='w-5 h-5 text-gray-600' />
      case 'hackathon':
        return <Calendar className='w-5 h-5 text-gray-600' />
      case 'ai_agent':
        return <Bot className='w-5 h-5 text-gray-600' />
    }
  }

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'admin':
        return '運営'
      case 'hackathon':
        return 'ハッカソン'
      case 'ai_agent':
        return 'AI Agent'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffHours / 24

    if (diffHours < 1) {
      return '数分前'
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}時間前`
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}日前`
    } else {
      return new Intl.DateTimeFormat('ja-JP', {
        month: 'short',
        day: 'numeric',
      }).format(date)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* ヘッダー */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <Bell className='w-6 h-6 text-gray-700' />
              <h1 className='text-2xl font-bold text-gray-900'>通知</h1>
              {unreadCount > 0 && (
                <span className='bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium'>
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant='outline' size='sm'>
                <CheckCheck className='w-4 h-4 mr-2' />
                全て既読にする
              </Button>
            )}
          </div>

          {/* フィルター */}
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Filter className='w-4 h-4 text-gray-500' />
              <label htmlFor='type-filter' className='text-sm text-gray-500'>
                種類:
              </label>
              <select
                id='type-filter'
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className='px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
              >
                <option value='all'>すべて</option>
                <option value='admin'>運営</option>
                <option value='hackathon'>ハッカソン</option>
                <option value='ai_agent'>AI Agent</option>
              </select>
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='read-filter' className='text-sm text-gray-500'>
                状態:
              </label>
              <select
                id='read-filter'
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value as typeof filterRead)}
                className='px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
              >
                <option value='all'>すべて</option>
                <option value='unread'>未読</option>
                <option value='read'>既読</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {filteredNotifications.length === 0 ? (
          <div className='text-center py-16'>
            <Bell className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-600 mb-2'>通知がありません</h2>
            <p className='text-gray-500'>新しい通知が届くとここに表示されます。</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all duration-200 bg-white border-l-4 ${
                  !notification.isRead
                    ? 'hover:shadow-md border-l-red-500 opacity-100'
                    : 'hover:shadow-sm border-l-transparent opacity-60'
                }`}
              >
                <CardContent className='p-5'>
                  <div className='flex items-start gap-4'>
                    {/* アイコン */}
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${
                        !notification.isRead ? 'bg-gray-100' : 'bg-gray-50'
                      }`}
                    >
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* メイン情報 */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center gap-3'>
                          <h3
                            className={`text-lg font-semibold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <Tag
                            variant='outline'
                            className={`text-xs px-2 py-1 ${
                              !notification.isRead
                                ? 'bg-gray-100 text-gray-700 border-gray-300'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                          >
                            {getTypeLabel(notification.type)}
                          </Tag>
                          {!notification.isRead && (
                            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`text-sm flex items-center gap-1 ${
                              !notification.isRead ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            <Clock className='w-4 h-4' />
                            {formatDate(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => markAsRead(notification.id)}
                              className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                            >
                              <Check className='w-4 h-4' />
                            </Button>
                          )}
                        </div>
                      </div>

                      <p
                        className={`mb-4 leading-relaxed ${
                          !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                        }`}
                      >
                        {notification.message}
                      </p>

                      {/* メタデータ */}
                      {notification.metadata?.tags && (
                        <div className='flex flex-wrap gap-2 mb-4'>
                          {notification.metadata.tags.map((tag, index) => (
                            <Tag
                              key={index}
                              variant='outline'
                              className={`text-xs px-2 py-1 ${
                                !notification.isRead
                                  ? 'border-gray-300 text-gray-600'
                                  : 'border-gray-200 text-gray-400'
                              }`}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      )}

                      {/* 詳細情報（ハッカソンのみ） */}
                      {notification.type === 'hackathon' && notification.metadata && (
                        <div
                          className={`mb-4 p-3 rounded-lg ${
                            !notification.isRead ? 'bg-gray-50' : 'bg-gray-30'
                          }`}
                        >
                          {notification.metadata.hackathonName && (
                            <div
                              className={`text-sm mb-1 ${
                                !notification.isRead ? 'text-gray-600' : 'text-gray-500'
                              }`}
                            >
                              <strong>イベント:</strong> {notification.metadata.hackathonName}
                            </div>
                          )}
                          {notification.metadata.deadline && (
                            <div
                              className={`text-sm mb-1 ${
                                !notification.isRead ? 'text-gray-600' : 'text-gray-500'
                              }`}
                            >
                              <strong>締切:</strong>{' '}
                              {new Intl.DateTimeFormat('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }).format(notification.metadata.deadline)}
                            </div>
                          )}
                          {notification.metadata.location && (
                            <div
                              className={`text-sm ${
                                !notification.isRead ? 'text-gray-600' : 'text-gray-500'
                              }`}
                            >
                              <strong>開催地:</strong> {notification.metadata.location}
                            </div>
                          )}
                        </div>
                      )}

                      {/* アクション */}
                      <div className='flex items-center justify-between'>
                        {notification.actionUrl && (
                          <Button
                            variant='outline'
                            size='sm'
                            asChild
                            className={!notification.isRead ? '' : 'opacity-80'}
                          >
                            <a href={notification.actionUrl} className='flex items-center gap-2'>
                              <ExternalLink className='w-4 h-4' />
                              {notification.actionText}
                            </a>
                          </Button>
                        )}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => deleteNotification(notification.id)}
                          className='text-gray-400 hover:text-red-500 ml-auto'
                        >
                          削除
                        </Button>
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

export default NotificationPage
