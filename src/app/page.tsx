import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSession } from '@/features/auth/config/auth'

export default async function Home() {
  const session = await getSession()

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm'>
        <h1 className='text-4xl font-bold text-center mb-8'>Welcome to Next.js App</h1>

        {session ? (
          <div className='text-center'>
            <p className='mb-4'>こんにちは、{session.user?.name}さん！</p>
            <p className='text-gray-600 mb-6'>ログイン済みです</p>
            <Link href='/signin'>
              <Button variant='outline'>アカウント管理</Button>
            </Link>
          </div>
        ) : (
          <div className='text-center'>
            <p className='mb-6'>アプリを使用するにはログインが必要です</p>
            <Link href='/signin'>
              <Button className='bg-blue-500 hover:bg-blue-600 text-white'>ログイン</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
