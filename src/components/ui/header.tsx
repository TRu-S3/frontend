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
import { clearIdToken } from '@/lib/auth-token'
import { firebaseSignOut } from '@/features/auth/firebase/client'
import { useCallback, useState } from 'react'

// 型定義
interface HeaderProps {
  session: Session | null
}

interface NavigationItem {
  href: string
  label: string
  isAuthenticated: boolean
}

// 定数
const BRAND_NAME = 'UltraSoulMatch.ai'
const BRAND_LOGO_SIZE = 'w-10 h-10'
const AVATAR_SIZE = 'h-8 w-8'

// ナビゲーションアイテム
const AUTHENTICATED_NAV_ITEMS: NavigationItem[] = [
  { href: '/home', label: 'ホーム', isAuthenticated: true },
  { href: '/dashboard', label: 'ダッシュボード', isAuthenticated: true },
]

const UNAUTHENTICATED_NAV_ITEMS: NavigationItem[] = [
  { href: '#features', label: '機能', isAuthenticated: false },
  { href: '#how-it-works', label: '使い方', isAuthenticated: false },
  { href: '#benefits', label: 'メリット', isAuthenticated: false },
  { href: '#pricing', label: '料金', isAuthenticated: false },
]

// ユーティリティ関数
const getInitials = (name?: string | null): string => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

const getBrandLink = (isAuthenticated: boolean): string => {
  return isAuthenticated ? '/home' : '/'
}

// ロゴコンポーネント
const BrandLogo = () => (
  <div
    className={`${BRAND_LOGO_SIZE} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20`}
  >
    <Users className='w-6 h-6 text-white font-bold' />
  </div>
)

// ブランド名コンポーネント
const BrandName = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <Link href={getBrandLink(isAuthenticated)}>
    <span className='text-2xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors'>
      {BRAND_NAME}
    </span>
  </Link>
)

// ナビゲーションリンクコンポーネント
const NavigationLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
  >
    {label}
  </Link>
)

// ナビゲーションコンポーネント
const Navigation = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navItems = isAuthenticated ? AUTHENTICATED_NAV_ITEMS : UNAUTHENTICATED_NAV_ITEMS

  return (
    <div className='hidden md:flex space-x-10 flex-1 justify-center'>
      {navItems.map((item) => (
        <NavigationLink key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  )
}

// ユーザーアバターコンポーネント
const UserAvatar = ({ session }: { session: Session }) => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return

    setIsSigningOut(true)
    try {
      // 保存されたトークンをクリア
      clearIdToken()
      // Firebaseからもログアウト
      await firebaseSignOut()
      // NextAuthからログアウト
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('ログアウトエラー:', error)
      setIsSigningOut(false)
    }
  }, [isSigningOut])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={`relative ${AVATAR_SIZE} rounded-full`}
          disabled={isSigningOut}
          aria-label='ユーザーメニューを開く'
        >
          <Avatar className={AVATAR_SIZE}>
            <AvatarImage
              src={session.user.image || undefined}
              alt={session.user.name || 'ユーザー'}
            />
            <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-36' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{session.user.name || 'ユーザー'}</p>
            <p className='text-xs leading-none text-muted-foreground'>{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/profile'>プロフィール</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>設定</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? 'ログアウト中...' : 'ログアウト'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ログインボタンコンポーネント
const LoginButton = () => (
  <Link href='/signin'>
    <Button className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/20 px-6 py-2 text-white font-bold'>
      今すぐ始める
    </Button>
  </Link>
)

export default function Header({ session }: HeaderProps) {
  const isAuthenticated = !!session

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-blue-500/20 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center h-16'>
          {/* 左側: ブランド */}
          <div className='flex items-center space-x-3 flex-1'>
            <BrandLogo />
            <BrandName isAuthenticated={isAuthenticated} />
          </div>

          {/* 中央: ナビゲーション */}
          <Navigation isAuthenticated={isAuthenticated} />

          {/* 右側: ユーザーアクション */}
          <div className='flex items-center space-x-4 flex-1 justify-end'>
            {isAuthenticated ? <UserAvatar session={session} /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  )
}
