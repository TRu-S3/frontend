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
        className='flex-1 flex flex-row bg-slate-200 min-h-0 px-[32px]'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <SidebarLeft />
        {/* メインコンテンツ：2/4 */}
        <div className='flex-1 min-w-[240px] bg-white'>
          <MainContent />
        </div>
        {/* サイドバー右：1/4 */}
        <div className='w-1/4 min-w-[180px] max-w-[340px] flex-shrink-0'>
          <SidebarRight />
        </div>
      </main>
    </div>
  )
}
