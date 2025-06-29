import SidebarRight from './components/SidebarRight'
import MainContent from './components/MainContent'
import SidebarLeft from './components/SidebarLeft'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/features/auth/config/authOptions'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <main
        className='flex-1 flex flex-row bg-slate-200 min-h-0 px-[32px] justify-center'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        {/* サイドバー左：固定幅 */}
        <div className='w-[300px] flex-shrink-0'>
          <SidebarLeft />
        </div>
        {/* メインコンテンツ：固定幅（Twitterライク） */}
        <div className='min-w-[600px] bg-white flex-shrink-0'>
          <MainContent />
        </div>
        {/* サイドバー右：固定幅 */}
        <div className='w-[300px] flex-shrink-0'>
          <SidebarRight />
        </div>
      </main>
    </div>
  )
}
