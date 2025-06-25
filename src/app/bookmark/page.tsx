import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/features/auth/config/authOptions'
import { BookmarkClient } from './components/BookmarkClient'

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

// モックデータ
const mockBookmarkedUsers: BookmarkedUser[] = [
  {
    id: '1',
    name: '田中 太郎',
    bio: 'フルスタックエンジニア。React・Node.jsを中心とした開発が得意です。チーム開発での経験も豊富で、アジャイル開発を好みます。',
    skills: ['React', 'Node.js', 'TypeScript', 'UI/UX'],
    hackathonCount: 12,
    contributions: 1247,
    repositories: 45,
    languages: ['TypeScript', 'JavaScript', 'Python'],
    location: '東京',
    githubUrl: 'https://github.com/tanaka-taro',
    addedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: '山田 花子',
    bio: 'データサイエンティスト。機械学習とデータ可視化のプロフェッショナル。Pythonでの分析基盤構築が得意です。',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Jupyter'],
    hackathonCount: 8,
    contributions: 892,
    repositories: 32,
    languages: ['Python', 'R', 'SQL'],
    location: '大阪',
    githubUrl: 'https://github.com/yamada-hanako',
    addedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: '佐藤 次郎',
    bio: 'モバイルアプリ開発者。React NativeとFlutterでのクロスプラットフォーム開発に精通しています。',
    skills: ['React Native', 'Flutter', 'Dart', 'Mobile UI'],
    hackathonCount: 15,
    contributions: 2156,
    repositories: 67,
    languages: ['Dart', 'JavaScript', 'Swift'],
    location: '神奈川',
    githubUrl: 'https://github.com/sato-jiro',
    addedAt: new Date('2024-01-08'),
  },
  {
    id: '4',
    name: '鈴木 美咲',
    bio: 'UI/UXデザイナー兼フロントエンドエンジニア。ユーザー体験を重視したデザインシステム構築が専門です。',
    skills: ['Figma', 'Design System', 'Vue.js', 'CSS'],
    hackathonCount: 6,
    contributions: 645,
    repositories: 28,
    languages: ['JavaScript', 'CSS', 'HTML'],
    location: '京都',
    githubUrl: 'https://github.com/suzuki-misaki',
    addedAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    name: '高橋 健太',
    bio: 'バックエンドエンジニア。クラウドインフラとAPIの設計・実装に特化。スケーラブルなシステム設計が得意です。',
    skills: ['Go', 'AWS', 'Docker', 'Kubernetes'],
    hackathonCount: 10,
    contributions: 1534,
    repositories: 52,
    languages: ['Go', 'Python', 'Shell'],
    location: '福岡',
    githubUrl: 'https://github.com/takahashi-kenta',
    addedAt: new Date('2024-01-03'),
  },
]

const BookmarkPage = async () => {
  // サーバーサイドでセッションを確認
  const session = await getServerSession(authOptions)

  // ログインしていない場合はルートにリダイレクト
  if (!session) {
    redirect('/')
  }

  return <BookmarkClient initialBookmarkedUsers={mockBookmarkedUsers} />
}

export default BookmarkPage
