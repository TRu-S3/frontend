'use client'

import { useState, useCallback } from 'react'
import { matchingApi, MatchingRequest, MatchingResponse, MatchingResult } from '@/lib/api/matching'

// フックの状態型
interface UseMatchingState {
  matches: MatchingResult[]
  analysisSummary: string
  loading: boolean
  error: string | null
  isInitialized: boolean
}

// フックの戻り値型
interface UseMatchingReturn extends UseMatchingState {
  findMatches: (request: MatchingRequest) => Promise<MatchingResponse>
  clearError: () => void
  reset: () => void
}

// エラーメッセージ作成ヘルパー
const createError = (message: string, error: unknown): string => {
  if (error instanceof Error) {
    return `${message}: ${error.message}`
  }
  return `${message}: ${String(error)}`
}

// APIエラーチェック
const isApiError = (error: unknown): error is { status: number; message: string } => {
  return typeof error === 'object' && error !== null && 'status' in error
}

export const useMatching = (): UseMatchingReturn => {
  // 状態管理
  const [state, setState] = useState<UseMatchingState>({
    matches: [],
    analysisSummary: '',
    loading: false,
    error: null,
    isInitialized: false,
  })

  // 状態更新ヘルパー
  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const setMatches = useCallback((matches: MatchingResult[], analysisSummary: string) => {
    setState((prev) => ({
      ...prev,
      matches,
      analysisSummary,
      isInitialized: true,
    }))
  }, [])

  // エラーハンドリング
  const handleError = useCallback(
    (error: unknown, operation: string) => {
      console.error(`Matching ${operation} failed:`, error)

      if (isApiError(error)) {
        // 認証エラーの場合
        if (error.status === 401) {
          setError('認証が必要です。ログインしてください。')
          return
        }

        // その他のAPIエラー
        setError(createError(`マッチングの${operation}に失敗しました`, error))
        return
      }

      // その他のエラー
      setError(createError(`マッチングの${operation}に失敗しました`, error))
    },
    [setError]
  )

  // マッチング実行
  const findMatches = useCallback(
    async (request: MatchingRequest): Promise<MatchingResponse> => {
      setLoading(true)
      setError(null)

      try {
        const response = await matchingApi.findMatches(request)
        setMatches(response.matches, response.analysis_summary)
        return response
      } catch (error) {
        handleError(error, '実行')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setMatches, handleError]
  )

  // エラークリア
  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  // リセット
  const reset = useCallback(() => {
    setState({
      matches: [],
      analysisSummary: '',
      loading: false,
      error: null,
      isInitialized: false,
    })
  }, [])

  return {
    ...state,
    findMatches,
    clearError,
    reset,
  }
}
