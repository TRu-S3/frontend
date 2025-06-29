'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState, useEffect, useRef } from 'react'

export default function SidebarLeft() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'bot'; options?: string[] }[]
  >([])
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

  const handleOptionClick = (option: string) => {
    const userMsg = { text: option, sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])

    // 絵文字と番号を除去してキーワードを抽出
    const cleanOption = option
      .replace(/[0-9️⃣]/g, '') // 数字と絵文字を除去
      .replace(/^\s+|\s+$/g, '') // 前後の空白を除去

    setTimeout(() => {
      const response = generateResponse(cleanOption)
      setMessages((prev) => [...prev, { text: response, sender: 'bot' as const }])
    }, 500)
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { text: input, sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // ユーザーの入力に応じた応答を生成
    setTimeout(() => {
      const response = generateResponse(input)
      setMessages((prev) => [...prev, { text: response, sender: 'bot' as const }])
    }, 500)
  }

  const generateResponse = (userInput: string): string => {
    const input = userInput.trim().toLowerCase()

    // 番号による選択肢の処理
    if (input.includes('1') || input.includes('募集') || input.includes('投稿')) {
      return `📝 **ハッカソン募集の投稿方法**\n\n1. **右サイドバーのあなたへのおすすめ募集の横の「+」ボタンをクリック**\n2. **募集情報を入力**\n   • ハッカソン名\n   • 募集人数（フロントエンド、バックエンド、AI）\n   • 締切日\n   • ハッカソンに出る目的\n   • メッセージ\n3. **投稿完了！**\n\n募集は他のユーザーに表示されます。`
    }

    if (input.includes('2') || input.includes('チーム') || input.includes('メンバー')) {
      return `👥 **チームメンバーの探し方**\n\n1. **メイン画面でユーザーを閲覧**\n   • 似ているユーザー\n   • 求めているユーザー\n2. **プロフィールを確認**\n   • スキル情報\n   • 過去の募集\n   • 自己紹介\n3. **ブックマークで保存**\n4. **メッセージで連絡**\n\n気になるユーザーを見つけたら、まずはブックマークして後で確認しましょう！`
    }

    if (input.includes('3') || input.includes('ブックマーク')) {
      return `⭐ **ブックマーク機能の使い方**\n\n**ブックマークする**\n• 気になるユーザーのカードに「⭐」ボタンをクリック\n• 後で確認したい募集を保存\n\n**ブックマークを確認**\n• 左サイドバーの「ブックマーク」ボタンをクリック\n• 保存したユーザーや募集を一覧表示\n\n**整理方法**\n• 定期的にブックマークを確認\n• 連絡済みのユーザーは削除\n• 新しい募集と比較検討\n\nブックマークを活用して、効率的にチームメンバーを見つけましょう！`
    }

    if (input.includes('4') || input.includes('通知')) {
      return `🔔 **通知機能について**\n\n**現在利用可能な通知**\n• 新しいメッセージ\n• ブックマークしたユーザーの新募集\n• システムからのお知らせ\n\n**通知の確認方法**\n• 左サイドバーの「通知」ボタンをクリック\n• 未読通知の確認\n• 通知履歴の閲覧\n\n通知を有効にして、チャンスを逃さないようにしましょう！`
    }

    // プロフィール充実の詳細選択肢
    if (input.includes('スキル') || input.includes('技術')) {
      return `🎯 **スキル情報の追加方法**\n\n**得意分野の選択**\n• フロントエンド開発\n• バックエンド開発\n• AI/機械学習\n• デザイン\n• プロジェクトマネジメント\n\n**経験年数**\n• プログラミング経験\n• ハッカソン参加経験\n• チーム開発経験\n\n**技術スタック**\n• 使用言語（JavaScript, Python, Go等）\n• フレームワーク（React, Vue, Django等）\n• ツール（Git, Docker, AWS等）\n\n**レベル感**\n• 初心者\n• 中級者\n• 上級者\n\n具体的なスキルを記載すると、より良いマッチングが期待できます！`
    }

    if (input.includes('自己紹介') || input.includes('紹介')) {
      return `💬 **自己紹介文の書き方**\n\n**興味のある分野**\n• 特に興味のある技術\n• やりたいプロジェクト\n• 学びたいスキル\n\n**チームでやりたいこと**\n• リーダーシップ\n• 技術的な貢献\n• デザイン面での貢献\n\n**目標やビジョン**\n• 短期目標（次のハッカソン）\n• 長期目標（キャリア）\n• チームでの役割\n\n**性格・コミュニケーション**\n• 作業スタイル\n• コミュニケーション方法\n• チームワークの考え方\n\n魅力的な自己紹介で、良いチームメンバーを見つけましょう！`
    }

    // デフォルトの応答
    return 'こんにちは！私はAIです。どのようにお手伝いできますか？\n\n「このプロダクトの使い方は？」ボタンを押すと、詳しいガイドをご覧いただけます。'
  }

  const handleProfileButton = () => {
    const userMsg = { text: 'プロフィールを充実させる', sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'プロフィールを充実させる方法についてご案内します！どの部分について詳しく知りたいですか？',
          sender: 'bot' as const,
          options: [
            '1️⃣ スキル情報の追加',
            '2️⃣ 自己紹介文の書き方'
          ]
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
          text: 'このプロダクトの使い方についてご説明します！どの部分について詳しく知りたいですか？',
          sender: 'bot' as const,
          options: [
            '1️⃣ ハッカソン募集の投稿',
            '2️⃣ チームメンバーの探し方',
            '3️⃣ ブックマーク機能',
            '4️⃣ 通知設定',
          ],
        },
      ])
    }, 500)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <aside className='hidden lg:flex sticky top-[56px] left-0 z-20 flex-col border-r bg-gradient-to-b from-slate-50 to-white h-[calc(100vh-56px)] w-full'>
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
                  <div className='whitespace-pre-wrap prose prose-sm max-w-none'>
                    {msg.text.split('\n').map((line, lineIdx) => {
                      // 太字の処理（行全体または部分的な太字）
                      if (line.includes('**')) {
                        const parts = line.split(/(\*\*.*?\*\*)/g)
                        return (
                          <div key={lineIdx} className='mb-2'>
                            {parts.map((part, partIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <span key={partIdx} className='font-bold text-gray-900'>
                                    {part.replace(/\*\*/g, '')}
                                  </span>
                                )
                              }
                              return <span key={partIdx}>{part}</span>
                            })}
                          </div>
                        )
                      }

                      // リスト項目の処理
                      if (line.startsWith('•')) {
                        return (
                          <div key={lineIdx} className='flex items-start gap-2 mb-1'>
                            <span className='text-blue-500 mt-1'>•</span>
                            <span>{line.substring(1).trim()}</span>
                          </div>
                        )
                      }

                      // 番号付きリストの処理
                      if (line.match(/^\d+\./)) {
                        return (
                          <div key={lineIdx} className='font-semibold text-gray-800 mb-1'>
                            {line}
                          </div>
                        )
                      }

                      // 空行の処理
                      if (line.trim() === '') {
                        return <div key={lineIdx} className='h-2'></div>
                      }

                      // 通常のテキスト
                      return (
                        <div key={lineIdx} className='mb-1'>
                          {line}
                        </div>
                      )
                    })}
                  </div>
                  {msg.options && (
                    <div className='mt-3 space-y-2'>
                      {msg.options.map((option, optionIdx) => (
                        <button
                          key={optionIdx}
                          onClick={() => handleOptionClick(option)}
                          className='w-full text-left p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-700 transition-colors duration-200'
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
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
