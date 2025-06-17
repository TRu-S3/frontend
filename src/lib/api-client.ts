'use client'

import { getIdToken } from './auth-token'

// APIリクエストの設定型
interface ApiRequestConfig extends RequestInit {
  endpoint: string
  requireAuth?: boolean
}

// レスポンスの型
interface ApiResponse<T = unknown> {
  data: T
  status: number
  ok: boolean
}

// APIエラーの型
export class ApiError extends Error {
  constructor(public status: number, public statusText: string, message?: string) {
    super(message || `API Error: ${status} ${statusText}`)
  }
}

// 認証済みAPIクライアント
export const apiClient = {
  async request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const { endpoint, requireAuth = true, headers = {}, ...init } = config

    // ヘッダーの設定
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    }

    // 認証が必要な場合はトークンを追加
    if (requireAuth) {
      const tokenStartTime = performance.now()
      const idToken = await getIdToken()
      const tokenEndTime = performance.now()
      const tokenElapsedTime = Math.round(tokenEndTime - tokenStartTime)

      if (idToken) {
        requestHeaders.Authorization = `Bearer ${idToken}`
        console.log(`🔐 APIリクエストのためのIDトークン取得完了（所要時間: ${tokenElapsedTime}ms）`)
      } else {
        console.warn(`⚠️ IDトークンの取得に失敗しました（所要時間: ${tokenElapsedTime}ms）`)
      }
    }

    // APIリクエストを実行
    const response = await fetch(endpoint, {
      ...init,
      headers: requestHeaders,
    })

    let data: T
    try {
      data = await response.json()
    } catch {
      data = null as T
    }

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, data as string)
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
    }
  },

  // GET リクエスト
  async get<T = unknown>(endpoint: string, requireAuth = true): Promise<T> {
    const response = await this.request<T>({ endpoint, method: 'GET', requireAuth })
    return response.data
  },

  // POST リクエスト
  async post<T = unknown>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'POST',
      body: JSON.stringify(body),
      requireAuth,
    })
    return response.data
  },

  // PUT リクエスト
  async put<T = unknown>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'PUT',
      body: JSON.stringify(body),
      requireAuth,
    })
    return response.data
  },

  // DELETE リクエスト
  async delete<T = unknown>(endpoint: string, requireAuth = true): Promise<T> {
    const response = await this.request<T>({ endpoint, method: 'DELETE', requireAuth })
    return response.data
  },
}
