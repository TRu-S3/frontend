import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Star, Plus, Mail } from 'lucide-react';

export default function SidebarRight() {
  return (
    <aside className="hidden lg:flex flex-col border-l bg-white h-full">
      <div className="p-6 border-b">
        <Button variant="outline" className="w-full flex items-center gap-2 mb-3 justify-center">
          <Mail className="w-5 h-5" />
          DM
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2 mb-2 justify-center">
          <Bell className="w-5 h-5" />
          通知
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
          <Star className="w-5 h-5 text-yellow-400" />
          ブックマーク
        </Button>
      </div>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">あなたへのおすすめ募集</span>
          <Plus className="w-5 h-5 text-gray-400" />
        </div>
          <Card className="mb-2">
          <CardContent className="p-4">
            <div className="font-bold mb-1">Zenn AI Agent Hackathon</div>
            <div className="text-xs text-gray-500 mb-1">ハッカソン、でませんか？ / 2/3名確定</div>
            <Button size="sm" className="w-full">一緒に応募しませんか？</Button>
          </CardContent>
        </Card>
      </div>
      <div className="p-6">
        <Card>
          <CardContent className="p-4">
            <div className="font-bold mb-2">AIおすすめイベント</div>
            <div className="text-xs text-gray-500 mb-4">
              例：Zenn AI Agent Hackathon<br />
              AIがあなたにおすすめするイベントの説明文がここに入ります。<br />
              チームを探したり、詳細を確認したりできます。
            </div>
            <div className="flex flex-col gap-1 items-start">
              <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800">詳細を見る</a>
              <Button size="sm" variant="outline">このハッカソンでチームを探す</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
} 