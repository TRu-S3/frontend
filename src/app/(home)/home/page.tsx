import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSession } from '@/features/auth/config/auth'
import HelloExample from '@/features/users/components/HelloExample'

export default async function Home() {
  const session = await getSession()

  return (
    <div className='flex flex-col items-center justify-center py-24 px-4'>
      <div className='max-w-4xl w-full text-center'>
        <h1 className='text-5xl font-bold text-gray-900 mb-6'>Welcome to MyApp</h1>
        <HelloExample />
        {session ? (
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-md p-8'>
              <h2 className='text-2xl font-semibold mb-4'>
                こんにちは、{session.user?.name}さん！
              </h2>
              <p className='text-gray-600 mb-6'>
                ログイン済みです。ダッシュボードでアカウント情報を確認できます。
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/dashboard'>
                  <Button className='bg-blue-500 hover:bg-blue-600 text-white'>
                    ダッシュボードへ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-semibold mb-4'>始めましょう</h2>
            <p className='text-gray-600 mb-6'>
              アプリを使用するにはGoogleアカウントでログインしてください
            </p>
            <Link href='/signin'>
              <Button className='bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3'>
                Googleでログイン
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
