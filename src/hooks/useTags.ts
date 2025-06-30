import { useState, useEffect, useCallback, useRef } from 'react'
import { tagsApi, Tag } from '@/lib/api/tags'
import { ApiError } from '@/lib/api-client'

// フックの設定型
interface UseTagsOptions {
  autoFetch?: boolean
  refetchInterval?: number
  fallbackTags?: Tag[]
}

// フックの状態型
interface UseTagsState {
  tags: Tag[]
  loading: boolean
  error: string | null
  isInitialized: boolean
}

// フックの戻り値型
interface UseTagsReturn extends UseTagsState {
  refetch: () => Promise<Tag[]>
  clearError: () => void
  reset: () => void
  getTagById: (id: number) => Tag | undefined
  getTagByName: (name: string) => Tag | undefined
}

// 定数
const DEFAULT_REFETCH_INTERVAL = 0 // デフォルトでは自動再取得しない

// デフォルトタグ
const DEFAULT_TAGS: Tag[] = [
  { id: 1, name: 'プログラミング', created_at: '', updated_at: '' },
  { id: 3, name: 'バックエンドエンジニア', created_at: '', updated_at: '' },
  { id: 4, name: 'フロントエンドエンジニア', created_at: '', updated_at: '' },
  { id: 5, name: 'AIエンジニア', created_at: '', updated_at: '' },
  { id: 6, name: 'インフラエンジニア', created_at: '', updated_at: '' },
  { id: 7, name: 'デザイナー', created_at: '', updated_at: '' },
  { id: 8, name: 'その他', created_at: '', updated_at: '' },
]

// ユーティリティ関数
const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}

const createError = (message: string, originalError?: unknown): string => {
  if (originalError && isApiError(originalError)) {
    return `${message}: ${originalError.message}`
  }
  return message
}

export const useTags = (options: UseTagsOptions = {}): UseTagsReturn => {
  const {
    autoFetch = true,
    refetchInterval = DEFAULT_REFETCH_INTERVAL,
    fallbackTags = DEFAULT_TAGS,
  } = options

  // 状態管理
  const [state, setState] = useState<UseTagsState>({
    tags: [],
    loading: false,
    error: null,
    isInitialized: false,
  })

  // リファクタリング用のref
  const abortControllerRef = useRef<AbortController | null>(null)
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 状態更新ヘルパー
  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const setTags = useCallback((tags: Tag[]) => {
    setState((prev) => ({ ...prev, tags, isInitialized: true }))
  }, [])

  // エラーハンドリング
  const handleError = useCallback(
    (error: unknown, operation: string) => {
      console.error(`Tags ${operation} failed:`, error)

      if (isApiError(error)) {
        // 認証エラーの場合
        if (error.status === 401) {
          setError('認証が必要です。ログインしてください。')
          return
        }

        // その他のAPIエラー
        setError(createError(`タグの${operation}に失敗しました`, error))
        return
      }

      // その他のエラー
      setError(createError(`タグの${operation}に失敗しました`, error))
    },
    [setError]
  )

  // タグ取得
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const response = await tagsApi.list()
      const tags = response.tags
      setTags(tags)
      return tags
    } catch (error) {
      // AbortErrorの場合は無視
      if (error instanceof Error && error.name === 'AbortError') {
        return []
      }

      handleError(error, '取得')

      // エラーの場合はフォールバックタグを設定
      console.warn('Using fallback tags due to API error')
      setTags(fallbackTags)
      return fallbackTags
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setTags, handleError, fallbackTags])

  // エラークリア
  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  // リセット
  const reset = useCallback(() => {
    setState({
      tags: [],
      loading: false,
      error: null,
      isInitialized: false,
    })
  }, [])

  // タグ検索ヘルパー
  const getTagById = useCallback(
    (id: number): Tag | undefined => {
      return state.tags.find((tag) => tag.id === id)
    },
    [state.tags]
  )

  const getTagByName = useCallback(
    (name: string): Tag | undefined => {
      return state.tags.find((tag) => tag.name === name)
    },
    [state.tags]
  )

  // 自動取得の設定
  useEffect(() => {
    if (autoFetch) {
      fetchTags()
    }
  }, [autoFetch, fetchTags])

  // 定期的な再取得の設定
  useEffect(() => {
    if (refetchInterval > 0) {
      refetchIntervalRef.current = setInterval(() => {
        fetchTags()
      }, refetchInterval)

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current)
          refetchIntervalRef.current = null
        }
      }
    }
  }, [refetchInterval, fetchTags])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current)
      }
    }
  }, [])

  return {
    ...state,
    refetch: fetchTags,
    clearError,
    reset,
    getTagById,
    getTagByName,
  }
}
