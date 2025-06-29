'use client'

import { getIdToken } from './auth-token'

// バックエンドのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-696136807010.asia-northeast1.run.app'

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

    // 認証が必要な場合のみトークンを追加
    if (requireAuth) {
      try {
        const idToken = await getIdToken()

        if (idToken) {
          requestHeaders.Authorization = `Bearer ${idToken}`
        } else {
          throw new ApiError(401, 'Unauthorized', 'IDトークンの取得に失敗しました')
        }
      } catch (error) {
        console.error('Token acquisition error:', error)
        throw new ApiError(401, 'Unauthorized', 'IDトークンの取得に失敗しました')
      }
    }

    // APIリクエストを実行
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
    
    let response: Response
    try {
      response = await fetch(fullUrl, {
        ...init,
        headers: requestHeaders,
      })
    } catch (error) {
      console.error('Network Error:', error)
      throw new ApiError(0, 'Network Error', `Failed to connect to ${fullUrl}: ${error}`)
    }

    // エラーチェックを先にする
    if (!response.ok) {
      let errorText = ''
      try {
        errorText = await response.text()
      } catch {
        errorText = 'Could not read error response'
      }
      let errorMessage = `API Error: ${response.status} ${response.statusText}`
      if (errorText) {
        errorMessage += ` - ${errorText}`
      }
      console.error(`API Error (${response.status}) at ${fullUrl}: ${errorMessage}`)
      throw new ApiError(response.status, response.statusText, errorMessage)
    }

    // 成功の場合のみパース
    let data: T
    try {
      const textResponse = await response.text()
      data = textResponse ? JSON.parse(textResponse) : null as T
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      throw new ApiError(response.status, 'JSON Parse Error', `Failed to parse response: ${parseError}`)
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
