'use client'

import { getIdToken } from './auth-token'

// バックエンドのベースURL
const BASE_URL = 'https://backend-696136807010.asia-northeast1.run.app'

// HTTPメソッドの型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// APIリクエストの設定型
interface ApiRequestConfig extends Omit<RequestInit, 'method' | 'body'> {
  endpoint: string
  method: HttpMethod
  body?: unknown
  requireAuth?: boolean
  allow404?: boolean
  timeout?: number
}

// レスポンスの型
interface ApiResponse<T = unknown> {
  data: T
  status: number
  ok: boolean
  headers: Headers
}

// APIエラーの型
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
    public response?: Response
  ) {
    super(message || `API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

// エラーレスポンスの型
interface ErrorResponse {
  error?: string
  message?: string
  status?: number
  details?: unknown
}

// タイムアウト設定
const DEFAULT_TIMEOUT = 30000 // 30秒

// ユーティリティ関数
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError(0, 'Timeout', `Request timeout after ${timeout}ms`))
    }, timeout)
  })
}

const parseErrorResponse = async (response: Response): Promise<ErrorResponse> => {
  try {
    const errorText = await response.text()
    if (!errorText) {
      return { error: 'Empty error response' }
    }
    return JSON.parse(errorText) as ErrorResponse
  } catch {
    return { error: 'Could not parse error response' }
  }
}

const createRequestHeaders = (config: ApiRequestConfig): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.headers as Record<string, string>),
  }

  // 認証が必要な場合のみトークンを追加
  if (config.requireAuth) {
    // トークンは後で非同期で追加
    return headers
  }

  return headers
}

const addAuthToken = async (headers: Record<string, string>): Promise<void> => {
  try {
    const idToken = await getIdToken()
    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`
    } else {
      throw new ApiError(401, 'Unauthorized', 'IDトークンの取得に失敗しました')
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // 機密情報をログに出力しない
    console.error(
      'Token acquisition error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    throw new ApiError(401, 'Unauthorized', 'IDトークンの取得に失敗しました')
  }
}

const handleApiError = async (
  response: Response,
  fullUrl: string,
  allow404: boolean
): Promise<never> => {
  // 404エラーが許容されている場合は特別に処理
  if (allow404 && response.status === 404) {
    throw new ApiError(404, 'Not Found', 'Resource not found', response)
  }

  const errorData = await parseErrorResponse(response)
  const errorMessage =
    errorData.error || errorData.message || `API Error: ${response.status} ${response.statusText}`

  // 機密情報をログに出力しない
  console.error(`API Error (${response.status}) at ${fullUrl}:`, {
    message: errorMessage,
    // details: errorData.details, // 機密情報の可能性があるため削除
    // headers: Object.fromEntries(response.headers.entries()), // 機密情報の可能性があるため削除
  })

  throw new ApiError(response.status, response.statusText, errorMessage, response)
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  try {
    const textResponse = await response.text()
    if (!textResponse) {
      return null as T
    }
    return JSON.parse(textResponse) as T
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError)
    throw new ApiError(
      response.status,
      'JSON Parse Error',
      `Failed to parse response: ${parseError}`,
      response
    )
  }
}

// 認証済みAPIクライアント
export const apiClient = {
  async request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const {
      endpoint,
      method,
      body,
      requireAuth = true,
      allow404 = false,
      timeout = DEFAULT_TIMEOUT,
      ...init
    } = config

    // ヘッダーの設定
    const requestHeaders = createRequestHeaders(config)

    // 認証が必要な場合のみトークンを追加
    if (requireAuth) {
      await addAuthToken(requestHeaders)
    }

    // APIリクエストを実行
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`

    // リクエストボディの準備
    const requestBody = body ? JSON.stringify(body) : undefined

    // タイムアウト付きのリクエスト
    const requestPromise = fetch(fullUrl, {
      ...init,
      method,
      body: requestBody,
      headers: requestHeaders,
    })

    let response: Response
    try {
      response = await Promise.race([requestPromise, createTimeoutPromise(timeout)])
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error('Network Error:', error)
      throw new ApiError(0, 'Network Error', `Failed to connect to ${fullUrl}: ${error}`)
    }

    // エラーチェック
    if (!response.ok) {
      await handleApiError(response, fullUrl, allow404)
    }

    // 成功の場合のみパース
    const data = await parseResponse<T>(response)

    return {
      data,
      status: response.status,
      ok: response.ok,
      headers: response.headers,
    }
  },

  // GET リクエスト
  async get<T = unknown>(
    endpoint: string,
    requireAuth = true,
    allow404 = false,
    timeout?: number
  ): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'GET',
      requireAuth,
      allow404,
      timeout,
    })
    return response.data
  },

  // POST リクエスト
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    requireAuth = true,
    timeout?: number
  ): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'POST',
      body,
      requireAuth,
      timeout,
    })
    return response.data
  },

  // PUT リクエスト
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    requireAuth = true,
    timeout?: number
  ): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'PUT',
      body,
      requireAuth,
      timeout,
    })
    return response.data
  },

  // PATCH リクエスト
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    requireAuth = true,
    timeout?: number
  ): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'PATCH',
      body,
      requireAuth,
      timeout,
    })
    return response.data
  },

  // DELETE リクエスト
  async delete<T = unknown>(endpoint: string, requireAuth = true, timeout?: number): Promise<T> {
    const response = await this.request<T>({
      endpoint,
      method: 'DELETE',
      requireAuth,
      timeout,
    })
    return response.data
  },
}
