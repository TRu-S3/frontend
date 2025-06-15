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
        className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] grid-rows-[1fr_auto] gap-0 bg-gray-50 min-h-0"
        style={{ minHeight: 'calc(100vh - 56px)' }}
      >
        <SidebarLeft />
        <MainContent />
        <SidebarRight />
      </main>
    </div>
  );
} 