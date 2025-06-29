'use client'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatedProgress } from '@/app/searching/animated-progress'

export default function Searching() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = searchParams.get('url')
    
    if (url) {
      console.log('GitHub Profile URL:', url)
      
      // ai-agentバックエンドAPIを呼び出し（一度だけ実行）
      let hasExecuted = false
      const callAiAgent = async () => {
        if (hasExecuted) return
        hasExecuted = true
        try {
          console.log('Calling ai-agent backend with URL:', url)
          
          // 1. 実行IDの作成
          const createRunResponse = await fetch('/api/ai-agent/create-run', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          })
          
          if (!createRunResponse.ok) {
            throw new Error(`Failed to create run: ${createRunResponse.status}`)
          }
          
          const runData = await createRunResponse.json()
          console.log('Run created:', runData)
          
          // 2. ワークフローの開始
          const response = await fetch(`/api/ai-agent/start?runId=${runData.runId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              inputData: { 
                username: url.replace('https://github.com/', '').replace('http://github.com/', '') 
              } 
            })
          })
          
          if (response.ok) {
            const result = await response.json()
            console.log('AI Agent Response:', result)
            
            // ワークフローの完了を待つ
            if (result.message === "Workflow run started") {
              console.log('Waiting for workflow completion...')
              
              // 定期的に実行状況をチェック
              const checkStatus = async () => {
                for (let i = 0; i < 60; i++) { // 最大60回チェック（5分間）
                  await new Promise(resolve => setTimeout(resolve, 5000)) // 5秒待機
                  
                  try {
                    const statusResponse = await fetch(`/api/ai-agent/runs`)
                    if (statusResponse.ok) {
                      const statusData = await statusResponse.json()
                      const latestRun = statusData.runs?.[0]
                      
                      if (latestRun?.snapshot?.status === 'success') {
                        console.log('Workflow completed successfully!')
                        console.log('Final Result:', latestRun.snapshot.result)
                        break
                      } else if (latestRun?.snapshot?.status === 'failed') {
                        console.error('Workflow failed:', latestRun.snapshot.error)
                        break
                      } else {
                        console.log(`Workflow status: ${latestRun?.snapshot?.status || 'running'}`)
                      }
                    }
                  } catch (error) {
                    console.error('Error checking workflow status:', error)
                  }
                }
              }
              
              checkStatus()
            }
          } else {
            console.error('AI Agent API Error:', response.status, response.statusText)
          }
        } catch (error) {
          console.error('Failed to call AI Agent API:', error)
        }
      }
      
      callAiAgent()
    } else {
      console.log('No URL parameter found')
    }

    const timer = setTimeout(() => {
      router.push('/demo')
    }, 25000)

    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <main className='min-h-screen w-full bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center'>
      <div className='container mx-auto px-4 -mt-20'>
        <AnimatedProgress />
      </div>
    </main>
  )
}
