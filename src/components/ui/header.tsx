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
import { Users } from 'lucide-react'

interface HeaderProps {
  session: Session | null
}

export default function Header({ session }: HeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className=' bg-white/90 backdrop-blur-xl border-b border-blue-500/20 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center h-16'>
          <div className='flex items-center space-x-3 flex-1'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20'>
              <Users className='w-6 h-6 text-white font-bold' />
            </div>
            <span className='text-2xl font-bold text-gray-900 tracking-tight'>SupaMatch.ai</span>
          </div>
          <div className='hidden md:flex space-x-10 flex-1 justify-center'>
            {session ? (
              <>
                <Link
                  href='/home'
                  className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
                >
                  ホーム
                </Link>
                <Link
                  href='/dashboard'
                  className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
                >
                  ダッシュボード
                </Link>
              </>
            ) : (
              <>
                <Link
                  href='#features'
                  className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
                >
                  機能
                </Link>
                <Link
                  href='#how-it-works'
                  className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
                >
                  使い方
                </Link>
                <Link
                  href='#benefits'
                  className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
                >
                  メリット
                </Link>
                <Link
                  href='#pricing'
                  className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
                >
                  料金
                </Link>
              </>
            )}
          </div>
          {/* ユーザーアイコン */}
          <div className='flex items-center space-x-4 flex-1 justify-end'>
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
                <Button className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/20 px-6 py-2 text-white font-bold'>
                  今すぐ始める
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
