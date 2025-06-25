import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/features/auth/config/authOptions'
import { NotificationClient } from './components/NotificationClient'

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

const NotificationPage = async () => {
  // サーバーサイドでセッションを確認
  const session = await getServerSession(authOptions)

  // ログインしていない場合はルートにリダイレクト
  if (!session) {
    redirect('/')
  }

  return <NotificationClient initialNotifications={mockNotifications} />
}

export default NotificationPage
