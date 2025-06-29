import { useState, useCallback } from 'react'

interface OGPData {
  title?: string
  description?: string
  image?: string
  url?: string
}

interface UseOGPReturn {
  ogpData: OGPData | null
  loading: boolean
  error: string | null
  fetchOGP: (url: string) => Promise<void>
}

// メモリキャッシュ
const ogpCache = new Map<string, OGPData>()

export function useOGP(): UseOGPReturn {
  const [ogpData, setOgpData] = useState<OGPData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOGP = useCallback(async (url: string) => {
    if (!url) return
    
    // キャッシュチェック
    if (ogpCache.has(url)) {
      setOgpData(ogpCache.get(url) || null)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`)
      
      if (!response.ok) {
        throw new Error('OGPデータの取得に失敗しました')
      }
      
      const data = await response.json()
      
      // キャッシュに保存
      ogpCache.set(url, data)
      setOgpData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setOgpData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    ogpData,
    loading,
    error,
    fetchOGP
  }
} 