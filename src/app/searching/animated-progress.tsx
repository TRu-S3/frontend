"use client"

import React, { useEffect, useState } from 'react'
import { Progress } from '../../components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Confetti } from '../../components/ui/confetti'

interface Phase {
  title: string
  subMessage: string
  icon: string
}

const phases: Phase[] = [
  { 
    title: 'URLを解析中', 
    subMessage: 'URLの内容を確認しています...', 
    icon: '🔍' 
  },
  { 
    title: 'データを生成中', 
    subMessage: 'データを準備しています...', 
    icon: '⚡' 
  },
  { 
    title: 'データベースを構築中', 
    subMessage: 'データベースを最適化しています...', 
    icon: '🗄️' 
  },
  { 
    title: '関係性をマッピング中', 
    subMessage: '関連性を分析しています...', 
    icon: '🔄' 
  },
  { 
    title: 'トレーニングしています', 
    subMessage: 'もうすぐ完了します...', 
    icon: '🧠' 
  },
]

export function AnimatedProgress() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev === phases.length - 1) {
          setIsComplete(true)
          clearInterval(phaseInterval)
          setTimeout(() => {
            router.push('/demo')
          }, 3000)
          return prev
        }
        setProgress(0) // フェーズ切り替え時にプログレスをリセット
        return prev + 1
      })
    }, 5000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 1
      })
    }, 50) // 0.05秒ごとに1%ずつ増加

    return () => {
      clearInterval(phaseInterval)
      clearInterval(progressInterval)
    }
  }, [router])

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <Confetti isActive={isComplete} />
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-5xl mb-4"
              >
                {phases[currentPhase].icon}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                {phases[currentPhase].title}
              </h2>
              <p className="text-gray-600 text-lg">
                {phases[currentPhase].subMessage}
              </p>
            </div>
            <div className="relative w-full">
              <Progress value={progress} className="w-full" />
              <motion.div
                className="absolute right-0 top-0 text-sm font-medium text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(progress)}%
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              プロフィールが完成しました！
            </h2>
            <p className="text-gray-600 text-lg">
              デモページに移動します...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 