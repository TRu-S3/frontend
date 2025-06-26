'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState, useEffect, useRef } from 'react'

export default function SidebarLeft() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // メッセージが更新されたときに自動スクロール
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    }

    // 少し遅延を入れて確実にスクロール
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { text: input, sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    // Botのダミー返答を追加
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'こんにちは！私はAIです。どのようにお手伝いできますか？', sender: 'bot' as const },
      ])
    }, 500)
  }

  const handleProfileButton = () => {
    const userMsg = { text: 'プロフィールを充実させる', sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'プロフィールを充実させる方法についてご案内します！まずは基本情報から始めましょう。',
          sender: 'bot' as const,
        },
      ])
    }, 500)
  }

  const handleHowToButton = () => {
    const userMsg = { text: 'このプロダクトの使い方は？', sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'このプロダクトの使い方についてご説明します！ステップバイステップでサポートいたします。',
          sender: 'bot' as const,
        },
      ])
    }, 500)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <aside className='hidden lg:flex sticky top-[56px] left-0 z-20 flex-col border-r bg-gradient-to-b from-slate-50 to-white h-[calc(100vh-56px)] w-[280px] md:w-[340px]'>
      {/* ヘッダー */}
      <div className='p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm'>
        <h2 className='font-bold text-xl text-gray-800 tracking-tight'>AI チャット</h2>
        <p className='text-sm text-gray-500 mt-1'>何でもお気軽にお聞きください</p>
      </div>

      {/* メインコンテンツ */}
      <div className='flex-1 flex flex-col justify-end p-4 gap-4 overflow-hidden'>
        {/* クイックアクションボタン */}
        <div className='space-y-3'>
          <Button
            className='w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-medium'
            onClick={handleProfileButton}
          >
            ✨ プロフィールを充実させる
          </Button>
          <Button
            variant='outline'
            className='w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl font-medium text-gray-700'
            onClick={handleHowToButton}
          >
            📚 このプロダクトの使い方は？
          </Button>
        </div>

        {/* メッセージエリア */}
        <div
          ref={messagesContainerRef}
          className='flex flex-col gap-3 overflow-y-auto max-h-[45vh] md:max-h-[50vh] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          {messages.map((msg, idx) =>
            msg.sender === 'user' ? (
              <div
                key={idx}
                className='self-end bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] text-sm shadow-md'
              >
                {msg.text}
              </div>
            ) : (
              <div key={idx} className='self-start flex items-start gap-3 max-w-[85%]'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0 mt-1'>
                  <Avatar>
                    <AvatarImage src='/AI.webp' alt='AI' />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </div>
                <div className='bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-md text-gray-800'>
                  {msg.text}
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className='space-y-3'>
          <div className='flex items-center gap-3 bg-white rounded-2xl border-2 border-gray-200 p-2 hover:border-blue-300 transition-colors duration-200'>
            <Input
              placeholder='メッセージを入力してください...'
              className='flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <Button
              size='icon'
              className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200'
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className='w-4 h-4 text-white' />
            </Button>
          </div>

          {/* ユーザー情報 */}
          {/* <div className='flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-8 h-8 '>
                <AvatarImage src={session?.user?.image ?? ''} />
                <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className='text-sm font-medium text-gray-700'>{session?.user?.name}</span>
            </div>
            <MoreHorizontal className='w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200' />
          </div> */}
        </div>
      </div>
    </aside>
  )
}
