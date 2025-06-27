'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usersApi, User } from '@/lib/api/users'

export const useCurrentUser = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedEmail, setLastFetchedEmail] = useState<string | null>(null)


  useEffect(() => {
    
    const fetchUser = async () => {
      const currentEmail = session?.user?.email
      console.log('🎯 useCurrentUser: fetchUser開始, email =', currentEmail, 'lastFetched =', lastFetchedEmail)
      
      if (!currentEmail || typeof window === 'undefined') {
        console.log('🎯 useCurrentUser: セッションなしまたはSSR - スキップ')
        setLoading(false)
        setUser(null)
        return
      }

      // 既に同じemailで取得済みの場合はスキップ
      if (lastFetchedEmail === currentEmail) {
        console.log('🎯 useCurrentUser: 既に同じemailで取得済み - スキップ')
        setLoading(false)
        return
      }

      try {
        console.log('🎯 useCurrentUser: ユーザー検索開始')
        setLoading(true)
        setError(null)
        
        // Gmailでユーザーを検索
        const foundUser = await usersApi.findByGmail(currentEmail)
        setUser(foundUser)
        setLastFetchedEmail(currentEmail)
      } catch (err) {
        console.error('Failed to fetch current user:', err)
        setError('ユーザー情報の取得に失敗しました')
        setUser(null)
        setLastFetchedEmail(currentEmail) // エラーでも記録して重複を防ぐ
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [session?.user?.email]) // lastFetchedEmailを依存配列から削除

  return { user, loading, error, refetch: () => setLoading(true) }
}