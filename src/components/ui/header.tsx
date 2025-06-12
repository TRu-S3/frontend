'use client'

import Link from 'next/link'
import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
            <Link href='/dashboard' className='text-gray-600 hover:text-gray-900 transition-colors'>
              ダッシュボード
            </Link>
          </nav>

          {/* ユーザーアイコン */}
          <div className='flex items-center space-x-4'>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-36' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {session.user.name || 'ユーザー'}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>プロフィール</DropdownMenuItem>
                    <DropdownMenuItem>設定</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>ログアウト</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
