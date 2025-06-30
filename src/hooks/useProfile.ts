'use client'

import { useState, useEffect, useCallback } from 'react'
import { profilesApi, Profile } from '@/lib/api/profiles'
import { ApiError } from '@/lib/api-client'

interface UseProfileProps {
  userId?: number
  autoFetch?: boolean
}

export const useProfile = ({ userId, autoFetch = true }: UseProfileProps = {}) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (targetUserId?: number) => {
    if (!targetUserId) return

    try {
      setLoading(true)
      setError(null)
      
      const profileData = await profilesApi.getByUserId(targetUserId)
      setProfile(profileData)
    } catch (err) {
      // 404エラー（プロフィールが存在しない）の場合はエラーとして扱わない
      if (err instanceof ApiError && err.status === 404) {
        console.log(`Profile not found for user ID: ${targetUserId}`)
        setProfile(null)
        return
      }
      console.error('Failed to fetch profile:', err)
      setError('プロフィールの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfile = useCallback(
    async (profileData: {
      user_id: number
      tag_id?: number
      bio?: string
      age?: number
      location?: string
    }) => {
      try {
        setError(null)
        const newProfile = await profilesApi.create(profileData)
        setProfile(newProfile)
        return newProfile
      } catch (err) {
        console.error('Failed to create profile:', err)
        setError('プロフィールの作成に失敗しました')
        throw err
      }
    },
    []
  )

  const updateProfile = useCallback(
    async (
      profileId: number,
      profileData: {
        tag_id?: number
        bio?: string
        age?: number
        location?: string
      }
    ) => {
      try {
        setError(null)
        const updatedProfile = await profilesApi.update(profileId, profileData)
        setProfile(updatedProfile)
        return updatedProfile
      } catch (err) {
        console.error('Failed to update profile:', err)
        setError('プロフィールの更新に失敗しました')
        throw err
      }
    },
    []
  )

  const deleteProfile = useCallback(async (profileId: number) => {
    try {
      setError(null)
      await profilesApi.delete(profileId)
      setProfile(null)
    } catch (err) {
      console.error('Failed to delete profile:', err)
      setError('プロフィールの削除に失敗しました')
      throw err
    }
  }, [])

  useEffect(() => {
    if (autoFetch && userId) {
      fetchProfile(userId)
    }
  }, [autoFetch, userId, fetchProfile])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: () => fetchProfile(userId),
  }
}
