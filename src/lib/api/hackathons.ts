'use client'

import { apiClient } from '@/lib/api-client'

// ハッカソン型定義
export interface Hackathon {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  registration_start: string
  registration_deadline: string
  max_participants: number
  location: string
  organizer: string
  contact_email: string
  prize_info: string
  rules: string
  tech_stack: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  is_public: boolean
  banner_url: string
  website_url: string
  created_at: string
  updated_at: string
}

export interface CreateHackathonRequest {
  name: string
  description: string
  start_date: string
  end_date: string
  registration_start: string
  registration_deadline: string
  max_participants: number
  location: string
  organizer: string
  contact_email?: string
  prize_info?: string
  rules?: string
  tech_stack?: string
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  is_public?: boolean
  banner_url?: string
  website_url?: string
}

export interface UpdateHackathonRequest {
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  registration_start?: string
  registration_deadline?: string
  max_participants?: number
  location?: string
  organizer?: string
  contact_email?: string
  prize_info?: string
  rules?: string
  tech_stack?: string
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  is_public?: boolean
  banner_url?: string
  website_url?: string
}

export interface HackathonsListResponse {
  hackathons: Hackathon[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// ハッカソン管理API
export const hackathonsApi = {
  // ハッカソン作成
  async create(data: CreateHackathonRequest): Promise<Hackathon> {
    return await apiClient.post<Hackathon>('/api/v1/hackathons', data)
  },

  // ハッカソン一覧取得
  async list(params?: {
    page?: number
    limit?: number
    status?: string
    organizer?: string
    is_public?: boolean
  }): Promise<HackathonsListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.organizer) searchParams.set('organizer', params.organizer)
    if (params?.is_public !== undefined) searchParams.set('is_public', params.is_public.toString())

    const endpoint = `/api/v1/hackathons${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await apiClient.get<HackathonsListResponse>(endpoint, false) // 認証なし
  },

  // ハッカソン詳細取得
  async getById(id: number): Promise<Hackathon> {
    return await apiClient.get<Hackathon>(`/api/v1/hackathons/${id}`, false) // 認証なし
  },

  // ハッカソン更新
  async update(id: number, data: UpdateHackathonRequest): Promise<Hackathon> {
    return await apiClient.put<Hackathon>(`/api/v1/hackathons/${id}`, data)
  },

  // ハッカソン削除
  async delete(id: number): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/api/v1/hackathons/${id}`)
  },

  // 公開ハッカソン一覧取得
  async getPublic(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<HackathonsListResponse> {
    return await this.list({ ...params, is_public: true })
  },

  // 進行中のハッカソン取得
  async getOngoing(params?: {
    page?: number
    limit?: number
  }): Promise<HackathonsListResponse> {
    return await this.list({ ...params, status: 'ongoing' })
  },

  // 今後開催のハッカソン取得
  async getUpcoming(params?: {
    page?: number
    limit?: number
  }): Promise<HackathonsListResponse> {
    return await this.list({ ...params, status: 'upcoming' })
  }
}