'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

interface HeaderProps {
  session: Session | null
}

export default function Header({ session }: HeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* ロゴ */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>MY</span>
              </div>
              <span className='text-xl font-bold text-gray-900'>App</span>
            </Link>
          </div>

          {/* ナビゲーションメニュー */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link href='/' className='text-gray-600 hover:text-gray-900 transition-colors'>
              ホーム
            </Link>
            <Link
                href='/dashboard'
                className='text-gray-600 hover:text-gray-900 transition-colors'
              >
                ダッシュボード
              </Link>
          </nav>

          {/* ユーザーアイコン */}
          <div className='flex items-center space-x-4'>
            {session ? (
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-2'>
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'ユーザー'}
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                </div>
                <Button onClick={handleSignOut} variant='outline' size='sm' className='text-sm'>
                  ログアウト
                </Button>
              </div>
            ) : (
              <Link href='/signin'>
                <Button className='bg-blue-500 hover:bg-blue-600 text-white'>ログイン</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
