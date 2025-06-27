'use client'

import { apiClient } from '@/lib/api-client'

// ヘルスチェック関連の型定義
export interface HealthResponse {
  status: string
}

export interface StatusResponse {
  message: string
  status: string
}

// ヘルスチェックAPI
export const healthApi = {
  // 基本ヘルスチェック
  async getStatus(): Promise<StatusResponse> {
    return await apiClient.get<StatusResponse>('/', false) // 認証なし
  },

  // ヘルスチェック
  async checkHealth(): Promise<HealthResponse> {
    return await apiClient.get<HealthResponse>('/health', false) // 認証なし
  }
}