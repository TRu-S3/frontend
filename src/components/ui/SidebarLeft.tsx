import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal } from 'lucide-react';

export default function SidebarLeft() {
  return (
    <aside className="hidden lg:flex flex-col border-r bg-white h-full">
      <div className="p-6 border-b">
        <h2 className="font-bold text-lg mb-2">あなたが求めている人はどのような人でしょう？</h2>
        <p className="mb-4 text-sm font-semibold">XX人のエンジニアを探しています！</p>
        <Button className="w-full mb-2">プロフィールを充実させる</Button>
        <Button variant="outline" className="w-full">このプロダクトの使い方は？</Button>
      </div>
      <div className="flex-1 flex flex-col justify-end p-4 gap-2">
        <div className="flex items-center gap-2">
          <Input placeholder="メッセージを入力" className="flex-1" />
          <Button size="icon" variant="ghost">
            <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M2 12l15-5-5 15-2-7-7-2z"/></svg>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">ユーザー名</span>
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
} 