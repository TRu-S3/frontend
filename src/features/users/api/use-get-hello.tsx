'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// レスポンスの型定義
interface HelloResponse {
  message: string
  user?: {
    uid: string
    email: string
    name: string
  }
}

// API関数
const fetchHello = async (): Promise<HelloResponse> => {
  return await apiClient.get<HelloResponse>('/api/hello')
}

// カスタムフック
export const useGetHello = () => {
  return useQuery({
    queryKey: ['hello'],
    queryFn: fetchHello,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを新鮮とみなす
    gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
  })
}
