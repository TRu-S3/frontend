import { apiClient } from '@/lib/api-client'

// コンテスト型定義
export interface Contest {
  id: number
  backend_quota?: number
  frontend_quota?: number
  ai_quota?: number
  application_deadline: string
  purpose?: string
  message?: string
  author_id: number
  start_time?: string
  end_time?: string
  title?: string
  description?: string
  banner_url?: string
  website_url?: string
  status?: string
  created_at: string
  updated_at: string
}

export interface CreateContestRequest {
  title: string
  description: string
  author_id: number
  start_time: string
  end_time: string
  application_deadline: string
  banner_url?: string
  website_url?: string
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  purpose: string
  message: string
  backend_quota?: number
  frontend_quota?: number
  ai_quota?: number
}

export interface UpdateContestRequest {
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  application_deadline?: string
  banner_url?: string
  website_url?: string
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  purpose?: string
  message?: string
}

export interface ContestsListResponse {
  contests: Contest[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export const contestsApi = {
  // コンテスト一覧取得
  async list(params?: {
    page?: number
    limit?: number
    author_id?: number
    active?: boolean
  }): Promise<ContestsListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.author_id) searchParams.set('author_id', params.author_id.toString())
    if (params?.active !== undefined) searchParams.set('active', params.active ? 'true' : 'false')
    const endpoint = `/api/v1/contests${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await apiClient.get<ContestsListResponse>(endpoint, false)
  },

  // コンテスト詳細取得
  async getById(id: number): Promise<Contest> {
    return await apiClient.get<Contest>(`/api/v1/contests/${id}`, false)
  },

  // 新規コンテスト作成
  async create(data: CreateContestRequest): Promise<Contest> {
    return await apiClient.post<Contest>('/api/v1/contests', data)
  },

  // コンテスト更新
  async update(id: number, data: UpdateContestRequest): Promise<Contest> {
    return await apiClient.put<Contest>(`/api/v1/contests/${id}`, data)
  },

  // コンテスト削除
  async delete(id: number): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/api/v1/contests/${id}`)
  },
}
