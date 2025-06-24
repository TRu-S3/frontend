'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import React, { useState } from 'react';
import Image from 'next/image';

export default function SidebarLeft() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Botのダミー返答を追加
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'こんにちは！私はAIです。', sender: 'bot' as const }]);
    }, 500);
  };

  const handleProfileButton = () => {
    const userMsg = { text: 'プロフィールを充実させる', sender: 'user' as const };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'プロフィールを充実させる方法についてご案内します！', sender: 'bot' as const }]);
    }, 500);
  };

  const handleHowToButton = () => {
    const userMsg = { text: 'このプロダクトの使い方は？', sender: 'user' as const };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'このプロダクトの使い方についてご説明します！', sender: 'bot' as const }]);
    }, 500);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <aside className="hidden lg:flex flex-col border-r bg-white h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] min-w-[280px] w-full md:w-[340px]">
      <div className="p-6 border-b">
        <h2 className="font-bold text-lg mb-2">あなたが求めている人はどのような人でしょう？</h2>
        <p className="mb-4 text-sm font-semibold">XX人のエンジニアを探しています！</p>
        <Button className="w-full mb-2" onClick={handleProfileButton}>プロフィールを充実させる</Button>
        <Button variant="outline" className="w-full" onClick={handleHowToButton}>このプロダクトの使い方は？</Button>
      </div>
      <div className="flex-1 flex flex-col justify-end p-4 gap-2 overflow-y-auto max-h-[calc(100vh-220px)]">
        <div className="flex flex-col gap-2 mb-2 overflow-y-auto max-h-[40vh] md:max-h-[50vh]">
          {messages.map((msg, idx) =>
            msg.sender === 'user' ? (
              <div key={idx} className="self-end bg-blue-100 rounded-xl px-3 py-2 max-w-[80vw] md:max-w-[70%] text-sm break-words">
                {msg.text}
              </div>
            ) : (
              <div key={idx} className="self-start flex items-start gap-2 max-w-[85vw] md:max-w-[80%]">
                <Image src="/AI.webp" alt="AI" width={28} height={28} className="w-7 h-7 rounded-full object-cover mt-1" />
                <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm break-words">
                  {msg.text}
                </div>
              </div>
            )
          )}
        </div>
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="メッセージを入力"
            className="flex-1 min-w-0"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <Button size="icon" variant="ghost" onClick={handleSend}>
            <Image src="/send.svg" alt="送信" width={20} height={20} />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 ml-2">ユーザー名</span>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
} 