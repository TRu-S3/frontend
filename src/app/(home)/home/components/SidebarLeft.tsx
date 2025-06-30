'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { useState, useEffect, useRef } from 'react'
import { geminiAPI, ChatMessage } from '@/lib/gemini-api'
import { useMatching } from '@/hooks/useMatching'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProfile } from '@/hooks/useProfile'
import ChatUserCard from '@/components/user/ChatUserCard'

interface SidebarLeftProps {
  onUserSelect?: (userId: number) => void
}

export default function SidebarLeft({ onUserSelect }: SidebarLeftProps) {
  const [input, setInput] = useState('')
  type UserCardData = {
    id: number
    name: string
    gmail: string
    icon_url?: string
    created_at?: string
    updated_at?: string
  }
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'bot'; options?: string[]; userCards?: UserCardData[] }[]
  >([])
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)
  const [bioInterviewData, setBioInterviewData] = useState<{
    currentStep: number
    answers: Record<string, string>
    isInterviewMode: boolean
  }>({
    currentStep: 0,
    answers: {},
    isInterviewMode: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // フック
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { profile, loading: profileLoading } = useProfile({ userId: currentUser?.id })
  const { findMatches } = useMatching()

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
      // 「🤖 自己紹介文を自動生成する」ボタンの場合の特別処理
      if (cleanOption.includes('自動生成')) {
        // インタビューモードを開始
        setBioInterviewData({
          currentStep: 0,
          answers: {},
          isInterviewMode: true,
        })

        // 最初の質問を表示
        const firstQuestion = bioQuestions[0]
        setMessages((prev) => [
          ...prev,
          {
            text: `🤖 **自己紹介文自動生成インタビュー**\n\nより良い自己紹介文を作成するために、いくつか質問させていただきます。\n\n${firstQuestion.question}`,
            sender: 'bot' as const,
          },
        ])
        return
      }

      const response = generateResponse(cleanOption)

      // 自己紹介文の書き方の場合は、自動生成ボタンも追加
      if (cleanOption.includes('自己紹介') || cleanOption.includes('紹介')) {
        setMessages((prev) => [
          ...prev,
          {
            text: response,
            sender: 'bot' as const,
            options: ['🤖 自己紹介文を自動生成する'],
          },
        ])
      } else {
        setMessages((prev) => [...prev, { text: response, sender: 'bot' as const }])
      }
    }, 500)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = { text: input, sender: 'user' as const }
    setMessages((prev) => [...prev, userMsg])
    const userInput = input
    setInput('')

    // インタビューモードの処理
    if (bioInterviewData.isInterviewMode) {
      const currentQuestion = bioQuestions[bioInterviewData.currentStep]

      // 現在の質問に対する回答を保存
      const updatedAnswers = {
        ...bioInterviewData.answers,
        [currentQuestion.id]: userInput,
      }

      const nextStep = bioInterviewData.currentStep + 1

      // 次の質問がある場合
      if (nextStep < bioQuestions.length) {
        setBioInterviewData({
          ...bioInterviewData,
          currentStep: nextStep,
          answers: updatedAnswers,
        })

        const nextQuestion = bioQuestions[nextStep]
        setMessages((prev) => [
          ...prev,
          {
            text: nextQuestion.question,
            sender: 'bot' as const,
          },
        ])
      } else {
        // 全ての質問が完了した場合、自己紹介文を生成
        const finalAnswers = {
          ...updatedAnswers,
          [currentQuestion.id]: userInput,
        }

        setBioInterviewData({
          currentStep: 0,
          answers: {},
          isInterviewMode: false,
        })

        setIsLoading(true)

        try {
          const prompt = `以下の情報を基に、ハッカソン参加者向けの魅力的な自己紹介文を800文字程度で作成してください。

**収集した情報：**
- 名前: ${finalAnswers.name || '未回答'}
- 得意技術: ${finalAnswers.skills || '未回答'}
- 経験年数: ${finalAnswers.experience || '未回答'}
- 興味分野: ${finalAnswers.interests || '未回答'}
- 希望する役割: ${finalAnswers.role || '未回答'}
- 目標: ${finalAnswers.goals || '未回答'}
- コミュニケーションスタイル: ${finalAnswers.communication || '未回答'}

以下の要素を含めてください：
- ハッカソンでの目標や意欲
- 技術的な強みや経験
- チームでの役割や貢献
- コミュニケーションスタイル
- 学びたいことや成長したい分野

日本語で、親しみやすく、チームメンバーが見つけやすい内容にしてください。`

          const response = await geminiAPI.generateResponse(prompt, [])

          if (response.error) {
            console.error('Gemini API error:', response.error)
            setMessages((prev) => [
              ...prev,
              {
                text: '申し訳ございません。自己紹介文の生成に失敗しました。',
                sender: 'bot' as const,
              },
            ])
          } else {
            setMessages((prev) => [
              ...prev,
              {
                text: `✨ **あなた専用の自己紹介文を生成しました！**\n\n${response.text}\n\nこの自己紹介文をコピーして、プロフィール編集画面で使用してください。`,
                sender: 'bot' as const,
              },
            ])
          }
        } catch (error) {
          console.error('Failed to generate bio:', error)
          setMessages((prev) => [
            ...prev,
            {
              text: '申し訳ございません。自己紹介文の生成に失敗しました。',
              sender: 'bot' as const,
            },
          ])
        } finally {
          setIsLoading(false)
        }
      }
      return
    }

    // --- ここから新しい「似ているユーザー」自動マッチング処理 ---
    // 入力が「似ている」「マッチング」「相性」「探して」などを含む場合は即時マッチング
    const lowerInput = userInput.trim().toLowerCase()
    if (
      lowerInput.includes('似ている') ||
      lowerInput.includes('マッチング') ||
      lowerInput.includes('相性') ||
      lowerInput.includes('探して')
    ) {
      if (userLoading) {
        setMessages((prev) => [
          ...prev,
          { text: 'ログイン情報を取得中です。少々お待ちください。', sender: 'bot' as const },
        ])
        return
      }
      if (!currentUser) {
        setMessages((prev) => [
          ...prev,
          { text: 'ログインが必要です。まずはログインしてください。', sender: 'bot' as const },
        ])
        return
      }
      if (profileLoading) {
        setMessages((prev) => [
          ...prev,
          { text: 'プロフィール情報を取得中です。少々お待ちください。', sender: 'bot' as const },
        ])
        return
      }
      if (!profile) {
        setMessages((prev) => [
          ...prev,
          {
            text: 'あなたのプロフィール情報が未設定です。プロフィールを充実させてからマッチングをご利用ください。',
            sender: 'bot' as const,
          },
        ])
        return
      }
      setIsLoading(true)
      try {
        setMessages((prev) => [
          ...prev,
          {
            text: 'UltraSoulMatch.aiであなたのプロフィール情報をもとに、似ているユーザーを自動で分析・検索します！',
            sender: 'bot' as const,
          },
        ])
        const response = await findMatches({ user_id: currentUser.id, limit: 5 })
        setMessages((prev) => [
          ...prev,
          {
            text: `🔍 **AIマッチング結果**\n\n${response.analysis_summary}\n\n**推奨ユーザー:**`,
            sender: 'bot' as const,
            userCards: response.matches.map((m) => ({
              id: m.user_id,
              name: m.name,
              gmail: m.gmail,
              icon_url: m.icon_url,
              created_at: '',
              updated_at: '',
            })),
          },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          { text: '申し訳ございません。マッチングに失敗しました。', sender: 'bot' as const },
        ])
      } finally {
        setIsLoading(false)
      }
      return
    }
    // --- ここまで新しい「似ているユーザー」自動マッチング処理 ---

    // 従来の自己紹介文生成モードの処理
    if (isGeneratingBio) {
      setIsGeneratingBio(false)
      setIsLoading(true)

      try {
        const prompt = `以下の情報を基に、ハッカソン参加者向けの魅力的な自己紹介文を800文字程度で作成してください。

ユーザーの入力: "${userInput}"

以下の要素を含めてください：
- ハッカソンでの目標や意欲
- 技術的な強みや経験
- チームでの役割や貢献
- コミュニケーションスタイル
- 学びたいことや成長したい分野

日本語で、親しみやすく、チームメンバーが見つけやすい内容にしてください。`

        const response = await geminiAPI.generateResponse(prompt, [])

        if (response.error) {
          console.error('Gemini API error:', response.error)
          setMessages((prev) => [
            ...prev,
            {
              text: '申し訳ございません。自己紹介文の生成に失敗しました。',
              sender: 'bot' as const,
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: `✨ **あなた専用の自己紹介文を生成しました！**\n\n${response.text}\n\nこの自己紹介文をコピーして、プロフィール編集画面で使用してください。`,
              sender: 'bot' as const,
            },
          ])
        }
      } catch (error) {
        console.error('Failed to generate bio:', error)
        setMessages((prev) => [
          ...prev,
          {
            text: '申し訳ございません。自己紹介文の生成に失敗しました。',
            sender: 'bot' as const,
          },
        ])
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Gemini APIを使用
    setIsLoading(true)

    try {
      // 会話履歴を更新
      const updatedHistory = [...conversationHistory, { role: 'user' as const, parts: userInput }]
      setConversationHistory(updatedHistory)

      // Gemini APIから応答を取得
      const response = await geminiAPI.generateResponse(userInput, updatedHistory)

      if (response.error) {
        console.error('Gemini API error:', response.error)
      }

      // AI応答を会話履歴に追加
      const newHistory = [...updatedHistory, { role: 'model' as const, parts: response.text }]
      setConversationHistory(newHistory)

      // メッセージに追加
      setMessages((prev) => [...prev, { text: response.text, sender: 'bot' as const }])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      setMessages((prev) => [
        ...prev,
        {
          text: '申し訳ございません。AIチャット機能でエラーが発生しました。',
          sender: 'bot' as const,
        },
      ])
    } finally {
      setIsLoading(false)
    }
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
      return `💬 **自己紹介文の書き方**\n\n**興味のある分野**\n• 特に興味のある技術\n• やりたいプロジェクト\n• 学びたいスキル\n\n**チームでやりたいこと**\n• リーダーシップ\n• 技術的な貢献\n• デザイン面での貢献\n\n**目標やビジョン**\n• 短期目標（次のハッカソン）\n• 長期目標（キャリア）\n• チームでの役割\n\n**性格・コミュニケーション**\n• 作業スタイル\n• コミュニケーション方法\n• チームワークの考え方\n\n**連絡先・SNSアカウント**\n• X（Twitter）やGitHub、メールアドレスなど、連絡が取りやすい方法も記載すると親切です！\n\n魅力的な自己紹介で、良いチームメンバーを見つけましょう！\n\n🤖 **AIで自己紹介文を自動生成することもできます！**`
    }

    if (input.includes('自動生成') || input.includes('生成')) {
      // インタビューモードを開始
      setBioInterviewData({
        currentStep: 0,
        answers: {},
        isInterviewMode: true,
      })

      // 最初の質問を表示
      const firstQuestion = bioQuestions[0]
      return `🤖 **自己紹介文自動生成インタビュー**\n\nより良い自己紹介文を作成するために、いくつか質問させていただきます。\n\n${firstQuestion.question}`
    }

    // マッチング機能の処理
    if (
      input.includes('似ている') ||
      input.includes('マッチング') ||
      input.includes('相性') ||
      input.includes('探して')
    ) {
      if (userLoading) {
        return 'ログイン情報を取得中です。少々お待ちください。'
      }
      if (!currentUser) {
        return 'ログインが必要です。まずはログインしてください。'
      }
      if (profileLoading) {
        return 'プロフィール情報を取得中です。少々お待ちください。'
      }
      if (!profile) {
        return 'あなたのプロフィール情報が未設定です。プロフィールを充実させてからマッチングをご利用ください。'
      }
      return 'あなたのプロフィール情報をもとに、AIが似ているユーザーを自動で検索します。しばらくお待ちください...'
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
          options: ['1️⃣ スキル情報の追加', '2️⃣ 自己紹介文の書き方'],
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

  // 自己紹介文生成の質問リスト
  const bioQuestions = [
    {
      id: 'name',
      question: '👋 まずはお名前を教えてください（ニックネームでもOKです）',
      placeholder: '例：田中太郎',
    },
    {
      id: 'skills',
      question: '💻 得意な技術やプログラミング言語はありますか？',
      placeholder: '例：React, TypeScript, Python, デザイン',
    },
    {
      id: 'experience',
      question: '📚 プログラミングやハッカソンの経験年数はどのくらいですか？',
      placeholder: '例：プログラミング1年、ハッカソン初参加',
    },
    {
      id: 'interests',
      question: '🎯 特に興味のある分野や技術はありますか？',
      placeholder: '例：AI/機械学習、Webアプリ開発、UI/UXデザイン',
    },
    {
      id: 'role',
      question: '👥 チームではどのような役割を担いたいですか？',
      placeholder: '例：フロントエンド開発、リーダー、デザイン担当',
    },
    {
      id: 'goals',
      question: '🚀 ハッカソンで達成したい目標や学びたいことはありますか？',
      placeholder: '例：新しい技術を学ぶ、チーム開発の経験を積む',
    },
    {
      id: 'communication',
      question: '💬 コミュニケーションスタイルや作業スタイルについて教えてください',
      placeholder: '例：積極的に発言する、コツコツ作業する、リーダーシップを取りたい',
    },
  ]

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
                  {/* 推奨ユーザーのUserCard表示 */}
                  {msg.userCards && (
                    <div className='mt-4 flex flex-col gap-2'>
                      {msg.userCards.map((user, idx) => {
                        // 型ガードで安全に値を取り出す
                        const id = typeof user.id === 'number' ? user.id : idx
                        const name = typeof user.name === 'string' ? user.name : ''
                        const gmail = typeof user.gmail === 'string' ? user.gmail : ''
                        const icon_url =
                          typeof user.icon_url === 'string' ? user.icon_url : undefined
                        return (
                          <ChatUserCard
                            key={id}
                            user={{
                              id,
                              name,
                              gmail,
                              icon_url,
                              created_at: '',
                              updated_at: '',
                            }}
                            onClick={onUserSelect ? () => onUserSelect(id) : undefined}
                          />
                        )
                      })}
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
          {/* マッチング進捗バー */}
          {isLoading && (
            <div className='w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-2'>
              <div className='h-2 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse w-4/5 rounded-full transition-all duration-500' />
            </div>
          )}

          {/* インタビュー進行状況 */}
          {bioInterviewData.isInterviewMode && (
            <div className='bg-blue-50 rounded-xl p-3 border border-blue-200'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-blue-700'>
                  インタビュー進行中 ({bioInterviewData.currentStep + 1}/{bioQuestions.length})
                </span>
                <span className='text-xs text-blue-600'>
                  {Math.round(((bioInterviewData.currentStep + 1) / bioQuestions.length) * 100)}%
                </span>
              </div>
              <div className='w-full bg-blue-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${((bioInterviewData.currentStep + 1) / bioQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className='flex items-center gap-3 bg-white rounded-2xl border-2 border-gray-200 p-2 hover:border-blue-300 transition-colors duration-200'>
            <Input
              placeholder={
                bioInterviewData.isInterviewMode
                  ? bioQuestions[bioInterviewData.currentStep]?.placeholder ||
                    '回答を入力してください...'
                  : isGeneratingBio
                    ? 'あなたの特徴や希望を入力してください...'
                    : 'メッセージを入力してください...'
              }
              className='flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <Button
              size='icon'
              className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200'
              onClick={handleSend}
              disabled={
                !input.trim() || isLoading || (isGeneratingBio && !bioInterviewData.isInterviewMode)
              }
            >
              {isLoading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <Send className='w-4 h-4 text-white' />
              )}
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
