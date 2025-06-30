'use client'
import SidebarLeft from './components/SidebarLeft'
import MainContent from './components/MainContent'
import SidebarRight from './components/SidebarRight'
import { useState } from 'react'

export default function HomeClientPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <main
        className='flex-1 flex flex-row bg-slate-200 min-h-0 px-[32px] justify-center'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        {/* サイドバー左：固定幅 */}
        <div className='w-[300px] flex-shrink-0'>
          <SidebarLeft onUserSelect={setSelectedUserId} />
        </div>
        {/* メインコンテンツ：固定幅（Twitterライク） */}
        <div className='min-w-[600px] bg-white flex-shrink-0'>
          <MainContent selectedUserId={selectedUserId} />
        </div>
        {/* サイドバー右：固定幅 */}
        <div className='w-[300px] flex-shrink-0'>
          <SidebarRight />
        </div>
      </main>
    </div>
  )
}
