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
        <div className="font-bold mb-2">AIおすすめイベント？</div>
        <div className="text-xs text-gray-500 mb-4">
          ここにAIがあなたにおすすめするイベントの説明文が入ります。ワイヤーフレームの内容をそのまま記述。<br />
          例：「このハッカソンでチームを探す」「詳細を見る」などのボタンも下に配置。
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">このハッカソンでチームを探す</Button>
          <Button size="sm">詳細を見る</Button>
        </div>
      </div>
    </aside>
  );
} 