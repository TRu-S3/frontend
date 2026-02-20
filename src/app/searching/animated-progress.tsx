'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Progress } from '../../components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Confetti } from '../../components/ui/confetti'

const ANIMATION_CONFIG = {
  PROGRESS_INTERVAL: 50,
  COMPLETION_DELAY: 3000,
  PHASE_TRANSITION_DURATION: 0.5,
} as const

interface Phase {
  title: string
  subMessage: string
  icon: string
  duration: number
  id: string
}

const phases: Phase[] = [
  {
    id: 'gather-repository-info',
    title: 'gather-repository-info',
    subMessage: 'repositoryの情報を収集しています...(forkを除く)',
    icon: '🔍',
    duration: 5,
  },
  {
    id: 'clone-repository',
    title: 'clone-repository',
    subMessage: 'クローンしてコード解析やファイル処理を可能にしています...',
    icon: '⚡',
    duration: 5,
  },
  {
    id: 'commit-analyzer',
    title: 'commit-analyzer',
    subMessage: 'git logを使ってコミット統計の集計・解析をしています...',
    icon: '🗄️',
    duration: 10,
  },
  {
    id: 'tokei-analyzer',
    title: 'tokei-analyzer',
    subMessage: 'tokeiを使ってコードを分析しています...',
    icon: '🔄',
    duration: 15,
  },
  {
    id: 'code-summarizer',
    title: 'code-summarizer',
    subMessage: '解析し、記述内容をまとめています...',
    icon: '🧠',
    duration: 30,
  },
  {
    id: 'generate-report-yaml',
    title: 'generate-report-yaml',
    subMessage: '解析し、記述内容をまとめています...',
    icon: '📝',
    duration: 20,
  },
]

const calculateProgressIncrement = (duration: number): number => {
  return 100 / ((duration * 1000) / ANIMATION_CONFIG.PROGRESS_INTERVAL)
}

const getDotClassName = (index: number, currentPhase: number): string => {
  if (index < currentPhase) {
    return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
  }
  if (index === currentPhase) {
    return 'bg-gradient-to-r from-blue-400 to-purple-400 text-white animate-pulse'
  }
  return 'bg-gray-300 text-gray-600'
}

const logPhaseTransition = (from: number, to: number) => {
  console.log(`Phase transition: ${phases[from]?.title} → ${phases[to]?.title}`)
}

const ProgressDot = ({ index, currentPhase }: { index: number; currentPhase: number }) => {
  return (
    <div
      className='flex flex-col items-center'
      data-testid='progress-dot'
      data-phase={index}
      role='status'
      aria-label={`フェーズ ${index + 1}: ${index < currentPhase ? '完了' : index === currentPhase ? '実行中' : '待機中'}`}
    >
      <div
        className={`w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold ${getDotClassName(
          index,
          currentPhase
        )}`}
      >
        {index + 1}
      </div>
    </div>
  )
}

const CompletionScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className='text-center space-y-4'
      role='status'
      aria-live='polite'
      aria-label='プロフィール生成が完了しました'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className='text-6xl mb-4'
      >
        🎉
      </motion.div>
      <h2 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'>
        プロフィールが完成しました！
      </h2>
      <p className='text-gray-600 text-lg'>デモページに移動します...</p>
    </motion.div>
  )
}

interface AnimatedProgressProps {
  onComplete?: () => void
}

export function AnimatedProgress({ onComplete }: AnimatedProgressProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const currentPhaseData = useMemo(() => {
    const data = phases[currentPhase]
    if (!data) {
      setError(`Phase ${currentPhase} not found`)
      return null
    }
    return data
  }, [currentPhase])

  const progressIncrement = useMemo(() => {
    return currentPhaseData ? calculateProgressIncrement(currentPhaseData.duration) : 0
  }, [currentPhaseData])

  const handlePhaseComplete = useCallback(() => {
    setIsComplete(true)
    setTimeout(() => {
      try {
        if (onComplete) {
          onComplete()
        } else {
          router.push('/demo')
        }
      } catch (err) {
        setError('ページ遷移に失敗しました')
        console.error('Navigation error:', err)
      }
    }, ANIMATION_CONFIG.COMPLETION_DELAY)
  }, [router, onComplete])

  useEffect(() => {
    if (!currentPhaseData) return

    const phaseDuration = currentPhaseData.duration * 1000

    const phaseTimer = setTimeout(() => {
      setCurrentPhase((prev) => {
        const nextPhase = prev + 1
        logPhaseTransition(prev, nextPhase)

        if (nextPhase >= phases.length) {
          handlePhaseComplete()
          return prev
        }
        setProgress(0)
        setError(null) 
        return nextPhase
      })
    }, phaseDuration)

    return () => {
      clearTimeout(phaseTimer)
    }
  }, [currentPhase, currentPhaseData, handlePhaseComplete])

  useEffect(() => {
    if (!currentPhaseData || progressIncrement === 0) return

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + progressIncrement
      })
    }, ANIMATION_CONFIG.PROGRESS_INTERVAL)

    return () => {
      clearInterval(progressTimer)
    }
  }, [currentPhase, currentPhaseData, progressIncrement])


  if (error) {
    return (
      <div className='w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl'>
        <div className='text-center space-y-4'>
          <div className='text-4xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-red-600'>エラーが発生しました</h2>
          <p className='text-gray-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl'>
      <Confetti isActive={isComplete} />

      {/* 全体の進捗バー */}
      <div className='mb-6'>
        <div
          className='flex justify-between items-center'
          role='progressbar'
          aria-valuenow={currentPhase}
          aria-valuemin={0}
          aria-valuemax={phases.length}
          aria-label={`全体の進捗: ${currentPhase + 1}/${phases.length} フェーズ`}
        >
          {phases.map((phase, index) => (
            <ProgressDot key={phase.id} index={index} currentPhase={currentPhase} />
          ))}
        </div>
        <div className='flex justify-between mt-2'>
          <span className='text-xs text-gray-500'>開始</span>
          <span className='text-xs text-gray-500'>完了</span>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {!isComplete ? (
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: ANIMATION_CONFIG.PHASE_TRANSITION_DURATION }}
            className='space-y-6'
            role='status'
            aria-live='polite'
            aria-label={`フェーズ ${currentPhase + 1}: ${currentPhaseData?.title}`}
          >
            <div className='text-center space-y-2'>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='text-5xl mb-4'>
                {currentPhaseData?.icon}
              </motion.div>
              <h2 className='text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'>
                {currentPhaseData?.title}
              </h2>
              <p className='text-gray-600 text-lg'>{currentPhaseData?.subMessage}</p>
              <p className='text-sm text-gray-500'>
                {currentPhase + 1}/{phases.length}
              </p>
            </div>
            <div className='relative w-full'>
              <Progress
                value={progress}
                className='w-full'
                role='progressbar'
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`フェーズ ${currentPhase + 1} の進捗: ${Math.round(progress)}%`}
              />
              <motion.div
                className='absolute right-0 top-0 text-sm font-medium text-gray-700'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(progress)}%
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <CompletionScreen />
        )}
      </AnimatePresence>
    </div>
  )
}
