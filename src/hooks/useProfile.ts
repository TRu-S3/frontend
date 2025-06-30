'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  profilesApi,
  Profile,
  CreateProfileRequest,
  UpdateProfileRequest,
} from '@/lib/api/profiles'
import { ApiError } from '@/lib/api-client'

// フックの設定型
interface UseProfileOptions {
  userId?: number
  autoFetch?: boolean
  refetchInterval?: number
}

// フックの状態型
interface UseProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
  isInitialized: boolean
}

// フックの戻り値型
interface UseProfileReturn extends UseProfileState {
  fetchProfile: (targetUserId?: number) => Promise<Profile | null>
  createProfile: (profileData: CreateProfileRequest) => Promise<Profile>
  updateProfile: (profileId: number, profileData: UpdateProfileRequest) => Promise<Profile>
  deleteProfile: (profileId: number) => Promise<void>
  refetch: () => Promise<Profile | null>
  clearError: () => void
  reset: () => void
}

// 定数
const DEFAULT_REFETCH_INTERVAL = 0 // デフォルトでは自動再取得しない

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

export const useProfile = (options: UseProfileOptions = {}): UseProfileReturn => {
  const { userId, autoFetch = true, refetchInterval = DEFAULT_REFETCH_INTERVAL } = options

  // 状態管理
  const [state, setState] = useState<UseProfileState>({
    profile: null,
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

  const setProfile = useCallback((profile: Profile | null) => {
    setState((prev) => ({ ...prev, profile, isInitialized: true }))
  }, [])

  // エラーハンドリング
  const handleError = useCallback(
    (error: unknown, operation: string) => {
      console.error(`Profile ${operation} failed:`, error)

      if (isApiError(error)) {
        // 404エラー（プロフィールが存在しない）の場合はエラーとして扱わない
        if (error.status === 404) {
          console.log(`Profile not found for user ID: ${userId}`)
          setProfile(null)
          setError(null)
          return
        }

        // 認証エラーの場合
        if (error.status === 401) {
          setError('認証が必要です。ログインしてください。')
          return
        }

        // その他のAPIエラー
        setError(createError(`プロフィールの${operation}に失敗しました`, error))
        return
      }

      // その他のエラー
      setError(createError(`プロフィールの${operation}に失敗しました`, error))
    },
    [userId, setProfile, setError]
  )

  // プロフィール取得
  const fetchProfile = useCallback(
    async (targetUserId?: number): Promise<Profile | null> => {
      const userIdToFetch = targetUserId || userId
      if (!userIdToFetch) {
        console.warn('No user ID provided for profile fetch')
        return null
      }

      // 前のリクエストをキャンセル
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // 新しいAbortControllerを作成
      abortControllerRef.current = new AbortController()

      setLoading(true)
      setError(null)

      try {
        const profileData = await profilesApi.getByUserId(userIdToFetch)
        setProfile(profileData)
        return profileData
      } catch (error) {
        // AbortErrorの場合は無視
        if (error instanceof Error && error.name === 'AbortError') {
          return null
        }

        handleError(error, '取得')
        return null
      } finally {
        setLoading(false)
      }
    },
    [userId, setLoading, setError, setProfile, handleError]
  )

  // プロフィール作成
  const createProfile = useCallback(
    async (profileData: CreateProfileRequest): Promise<Profile> => {
      setLoading(true)
      setError(null)

      try {
        const newProfile = await profilesApi.create(profileData)
        setProfile(newProfile)
        return newProfile
      } catch (error) {
        handleError(error, '作成')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setProfile, handleError]
  )

  // プロフィール更新
  const updateProfile = useCallback(
    async (profileId: number, profileData: UpdateProfileRequest): Promise<Profile> => {
      setLoading(true)
      setError(null)

      try {
        const updatedProfile = await profilesApi.update(profileId, profileData)
        setProfile(updatedProfile)
        return updatedProfile
      } catch (error) {
        handleError(error, '更新')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setProfile, handleError]
  )

  // プロフィール削除
  const deleteProfile = useCallback(
    async (profileId: number): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        await profilesApi.delete(profileId)
        setProfile(null)
      } catch (error) {
        handleError(error, '削除')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setProfile, handleError]
  )

  // エラークリア
  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  // リセット
  const reset = useCallback(() => {
    setState({
      profile: null,
      loading: false,
      error: null,
      isInitialized: false,
    })
  }, [])

  // 自動取得の設定
  useEffect(() => {
    if (autoFetch && userId) {
      fetchProfile(userId)
    }
  }, [autoFetch, userId, fetchProfile])

  // 定期的な再取得の設定
  useEffect(() => {
    if (refetchInterval > 0 && userId) {
      refetchIntervalRef.current = setInterval(() => {
        fetchProfile(userId)
      }, refetchInterval)

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current)
          refetchIntervalRef.current = null
        }
      }
    }
  }, [refetchInterval, userId, fetchProfile])

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
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: () => fetchProfile(userId),
    clearError,
    reset,
  }
}
