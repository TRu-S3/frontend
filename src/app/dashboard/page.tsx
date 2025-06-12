import { redirect } from 'next/navigation'
import { getSession, getCurrentUser } from '@/features/auth/config/auth'
import Image from 'next/image'

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

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* ユーザープロフィール */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h2 className='text-xl font-semibold mb-6'>ユーザー情報</h2>
              <div className='flex items-center space-x-4 mb-6'>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'ユーザー'}
                    width={64}
                    height={64}
                    className='rounded-full'
                  />
                ) : (
                  <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center'>
                    <span className='text-gray-600 text-xl font-medium'>
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className='text-lg font-semibold'>{user.name}</h3>
                  <p className='text-gray-600'>{user.email}</p>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between py-2 border-b'>
                  <span className='font-medium text-gray-700'>名前:</span>
                  <span>{user.name}</span>
                </div>
                <div className='flex justify-between py-2 border-b'>
                  <span className='font-medium text-gray-700'>メール:</span>
                  <span>{user.email}</span>
                </div>
                <div className='flex justify-between py-2 border-b'>
                  <span className='font-medium text-gray-700'>ユーザーID:</span>
                  <span className='text-sm text-gray-500'>{user.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
