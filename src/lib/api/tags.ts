'use client'

import { apiClient } from '@/lib/api-client'

// タグ型定義
export interface Tag {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface TagsListResponse {
  tags: Tag[]
}

// タグ管理API
export const tagsApi = {
  // タグ一覧取得
  async list(): Promise<TagsListResponse> {
    return await apiClient.get<TagsListResponse>('/api/v1/tags', false)
  },

  // タグ詳細取得
  async getById(id: number): Promise<Tag> {
    return await apiClient.get<Tag>(`/api/v1/tags/${id}`, false)
  },
}
