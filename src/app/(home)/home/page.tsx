import SidebarRight from './components/SidebarRight'
import MainContent from './components/MainContent'
import SidebarLeft from './components/SidebarLeft'

export default async function Page() {
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <main
        className='flex-1 flex flex-row bg-slate-200 min-h-0 px-[32px]'
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        {/* サイドバー左：1/4 */}
        <div className='w-1/4 min-w-[180px] max-w-[340px] flex-shrink-0'>
          <SidebarLeft />
        </div>
        {/* メインコンテンツ：2/4 */}
        <div className='w-2/4 min-w-[240px] flex-1 bg-white'>
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
