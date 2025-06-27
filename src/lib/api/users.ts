'use client'

import { apiClient } from '@/lib/api-client'

// ユーザー型定義
export interface User {
  id: number
  name: string
  gmail: string
  icon_url?: string
  created_at: string
  updated_at?: string
}

export interface CreateUserRequest {
  name: string
  gmail: string
  icon_url?: string
}

export interface UpdateUserRequest {
  name?: string
  gmail?: string
  icon_url?: string
}

export interface UsersListResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// ユーザー管理API
export const usersApi = {
  // ユーザー作成
  async create(data: CreateUserRequest): Promise<User> {
    return await apiClient.post<User>('/api/v1/users', data)
  },

  // ユーザー一覧取得
  async list(params?: {
    page?: number
    limit?: number
    name?: string
    gmail?: string
  }): Promise<UsersListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.name) searchParams.set('name', params.name)
    if (params?.gmail) searchParams.set('gmail', params.gmail)

    const endpoint = `/api/v1/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await apiClient.get<UsersListResponse>(endpoint, false) // 認証なし
  },

  // ユーザー詳細取得
  async getById(id: number): Promise<User> {
    return await apiClient.get<User>(`/api/v1/users/${id}`, false) // 認証なし
  },

  // Gmailでユーザー検索
  async findByGmail(gmail: string): Promise<User | null> {
    try {
      const response = await this.list({ gmail, limit: 1 })
      return response.users.length > 0 ? response.users[0] : null
    } catch (error) {
      console.error('Failed to find user by gmail:', error)
      return null
    }
  },

  // ユーザー更新
  async update(id: number, data: UpdateUserRequest): Promise<User> {
    return await apiClient.put<User>(`/api/v1/users/${id}`, data)
  },

  // ユーザー削除
  async delete(id: number): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/api/v1/users/${id}`)
  },

  // ユーザーまたは作成（Googleログイン用）
  async findOrCreate(userData: CreateUserRequest): Promise<User> {
    try {
      // まずGmailで既存ユーザーを検索
      const existingUser = await this.findByGmail(userData.gmail)
      
      if (existingUser) {
        // 既存ユーザーがいる場合は情報を更新
        const updateData: UpdateUserRequest = {}
        if (userData.name !== existingUser.name) updateData.name = userData.name
        if (userData.icon_url && userData.icon_url !== existingUser.icon_url) updateData.icon_url = userData.icon_url
        
        if (Object.keys(updateData).length > 0) {
          return await this.update(existingUser.id, updateData)
        }
        
        return existingUser
      } else {
        // 新しいユーザーを作成
        return await this.create(userData)
      }
    } catch (error) {
      console.error('Failed to find or create user:', error)
      throw error
    }
  }
}