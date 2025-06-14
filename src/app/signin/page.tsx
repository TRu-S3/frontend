import Login from '@/features/auth/ui/components/Login'
import { getSession } from '@/features/auth/config/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className='flex' style={{ height: 'calc(100vh - 4rem)' }}>
      {/* 左側 - ビジュアルエリア */}
      <div className='hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='absolute inset-0 flex flex-col justify-center items-center text-white p-12 z-10'>
          <div className='max-w-md text-center'>
            <h1 className='text-4xl font-bold mb-6'>ようこそ</h1>
            <p className='text-xl mb-8 text-blue-100'>あなたの新しいデジタル体験が始まります</p>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                <div className='w-8 h-8 bg-white/20 rounded-full mb-2 mx-auto flex items-center justify-center'>
                  🚀
                </div>
                <p>高速</p>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                <div className='w-8 h-8 bg-white/20 rounded-full mb-2 mx-auto flex items-center justify-center'>
                  🔒
                </div>
                <p>安全</p>
              </div>
            </div>
          </div>
        </div>
        {/* 装飾的な図形 */}
        <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
        <div className='absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl'></div>
      </div>

      {/* 右側 - ログインエリア */}
      <div className='w-full md:w-1/2 bg-white flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <Login session={session} />
        </div>
      </div>
    </div>
  )
}
