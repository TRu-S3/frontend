import { redirect } from 'next/navigation'
import { getSession, getCurrentUser } from '@/features/auth/config/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  const user = await getCurrentUser()

  // 未認証の場合はサインインページにリダイレクト
  if (!session || !user) {
    redirect('/signin')
  }

  return (
    <div className='container mx-auto p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>ダッシュボード</h1>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>ユーザー情報</h2>
          <div className='space-y-2'>
            <p>
              <span className='font-medium'>名前:</span> {user.name}
            </p>
            <p>
              <span className='font-medium'>メール:</span> {user.email}
            </p>
            <p>
              <span className='font-medium'>ID:</span> {user.id}
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <Link href='/'>
            <Button variant='outline'>ホームに戻る</Button>
          </Link>
          <Link href='/signin'>
            <Button variant='secondary'>アカウント管理</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
