'use client'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatedProgress } from '@/app/searching/animated-progress'

export default function Searching() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasExecutedRef = useRef(false)
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [dataReady, setDataReady] = useState(false)

  // ai-agentバックエンドAPIを呼び出し
  const callAiAgent = useCallback(async (url: string) => {
    try {
      setStatus('loading')
      setErrorMessage('')
      
      // ここでYAMLデータ取得APIを呼び出す
      const username = url.replace('https://github.com/', '').replace('http://github.com/', '')
      console.log('Calling API with username:', username)
      
      const response = await fetch('/api/ai-agent/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        setErrorMessage(`API error: ${response.status} - ${errorText}`)
        setStatus('error')
        return
      }
      
      const data = await response.json()
      console.log('API Response data:', data)
      
      // sessionStorageに保存
      sessionStorage.setItem('aiResult', JSON.stringify(data))
      setStatus('success')
      setDataReady(true)
      // ここでは遷移しない
    } catch (error) {
      console.error('Failed to call AI Agent API:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(`通信エラー: ${errorMessage}`)
      setStatus('error')
    }
  }, [router])

  useEffect(() => {
    const url = searchParams.get('url')
    if (url && !hasExecutedRef.current) {
      hasExecutedRef.current = true
      callAiAgent(url)
    } else if (!url) {
      setErrorMessage('URLパラメータが見つかりません')
      setStatus('error')
    }
  }, [searchParams, callAiAgent])

  // アニメーション完了時にデータ取得済みなら遷移
  const handleAnimationComplete = useCallback(() => {
    if (dataReady) {
      router.push('/demo')
    } else {
      // データ未取得なら、取得完了まで待つ
      const interval = setInterval(() => {
        if (dataReady) {
          clearInterval(interval)
          router.push('/demo')
        }
      }, 300)
    }
  }, [dataReady, router])

  if (status === 'error') {
    return (
      <main className='min-h-screen w-full bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center'>
        <div className='container mx-auto px-4 text-center'>
          <div className='bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto'>
            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>エラーが発生しました</h2>
            <p className='text-gray-600 mb-6'>{errorMessage}</p>
            <button 
              onClick={() => router.push('/')}
              className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen w-full bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center'>
      <div className='container mx-auto px-4 -mt-20'>
        <AnimatedProgress 
          onComplete={handleAnimationComplete}
        />
      </div>
    </main>
  )
}
