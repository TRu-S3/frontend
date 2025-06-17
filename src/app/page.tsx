import { getServerSession } from "next-auth";
import Header from '@/components/ui/header';
import SidebarLeft from '../components/ui/SidebarLeft';
import SidebarRight from '@/components/ui/SidebarRight';
import MainContent from '@/components/ui/MainContent';

export default async function Page() {
  const session = await getServerSession();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header session={session} />
      <main
        className="flex-1 flex flex-row bg-gray-50 min-h-0"
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        {/* サイドバー左：1/4 */}
        <div className="w-1/4 min-w-[180px] max-w-[340px] flex-shrink-0">
          <SidebarLeft />
        </div>
        {/* メインコンテンツ：2/4 */}
        <div className="w-2/4 min-w-[240px] flex-1 min-w-0">
          <MainContent />
        </div>
        {/* サイドバー右：1/4 */}
        <div className="w-1/4 min-w-[180px] max-w-[340px] flex-shrink-0">
          <SidebarRight />
        </div>
      </main>
    </div>
  );
} 