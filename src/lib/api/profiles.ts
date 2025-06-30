'use client'

import { apiClient, ApiError } from '@/lib/api-client'

// プロフィール型定義
export interface Profile {
  id: number
  user_id: number
  tag_id?: number
  bio?: string
  age?: number
  location?: string
  created_at: string
  updated_at?: string
  tag?: {
    id: number
    name: string
    created_at: string
    updated_at: string
  }
}

export interface CreateProfileRequest {
  user_id: number
  tag_id?: number
  bio?: string
  age?: number
  location?: string
}

export interface UpdateProfileRequest {
  tag_id?: number
  bio?: string
  age?: number
  location?: string
}

export interface ProfilesListResponse {
  profiles: Profile[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// プロフィール管理API
export const profilesApi = {
  // プロフィール一覧取得
  async list(params?: {
    user_id?: number
    tag_id?: number
    location?: string
    min_age?: number
    max_age?: number
    page?: number
    limit?: number
  }): Promise<ProfilesListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.user_id) searchParams.set('user_id', params.user_id.toString())
    if (params?.tag_id) searchParams.set('tag_id', params.tag_id.toString())
    if (params?.location) searchParams.set('location', params.location)
    if (params?.min_age) searchParams.set('min_age', params.min_age.toString())
    if (params?.max_age) searchParams.set('max_age', params.max_age.toString())
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const endpoint = `/api/v1/profiles${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await apiClient.get<ProfilesListResponse>(endpoint, false)
  },

  // プロフィール作成
  async create(data: CreateProfileRequest): Promise<Profile> {
    return await apiClient.post<Profile>('/api/v1/profiles', data)
  },

  // プロフィール詳細取得
  async getById(id: number): Promise<Profile> {
    return await apiClient.get<Profile>(`/api/v1/profiles/${id}`, false)
  },

  // ユーザーIDでプロフィール取得
  async getByUserId(userId: number): Promise<Profile | null> {
    try {
      const response = await apiClient.get<Profile>(`/api/v1/profiles/user/${userId}`, false, true)
      return response
    } catch (error) {
      // 404エラー（プロフィールが存在しない）の場合はnullを返す
      if (error instanceof ApiError && error.status === 404) {
        console.log(`Profile not found for user ID: ${userId}`)
        return null
      }
      console.error('Failed to get profile by user ID:', error)
      return null
    }
  },

  // プロフィール更新
  async update(id: number, data: UpdateProfileRequest): Promise<Profile> {
    return await apiClient.put<Profile>(`/api/v1/profiles/${id}`, data)
  },

  // プロフィール削除
  async delete(id: number): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/api/v1/profiles/${id}`)
  },
}
