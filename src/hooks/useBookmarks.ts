'use client'

import { useState, useEffect, useCallback } from 'react'
import { bookmarksApi, Bookmark } from '@/lib/api/bookmarks'
import { User } from '@/lib/api/users'

interface UseBookmarksProps {
  userId?: number
  autoFetch?: boolean
}

export const useBookmarks = ({ userId, autoFetch = true }: UseBookmarksProps = {}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [bookmarkedUsers, setBookmarkedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookmarks = useCallback(async () => {
    console.log('🔖 useBookmarks: fetchBookmarks開始', { userId })
    
    if (!userId) {
      console.log('🔖 useBookmarks: userIdなし - スキップ')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // ブックマーク一覧を取得
      console.log('🔖 useBookmarks: ブックマーク一覧取得中')
      const response = await bookmarksApi.getUserBookmarks(userId)
      console.log('🔖 useBookmarks: ブックマーク一覧取得結果:', response)
      setBookmarks(response.bookmarks)

      // ブックマークされたユーザーの詳細情報を取得
      console.log('🔖 useBookmarks: ブックマークユーザー詳細取得中')
      const users = await bookmarksApi.getBookmarkedUsersWithDetails(userId)
      console.log('🔖 useBookmarks: ブックマークユーザー詳細取得結果:', users)
      setBookmarkedUsers(users)
    } catch (err) {
      console.error('🔖 useBookmarks: Failed to fetch bookmarks:', err)
      setError('ブックマークの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const addBookmark = useCallback(async (bookmarkedUserId: number) => {
    if (!userId) return

    try {
      setError(null)
      const result = await bookmarksApi.toggle(userId, bookmarkedUserId)
      
      if (result.isBookmarked) {
        // ブックマークが追加された場合は再取得
        await fetchBookmarks()
      }
      
      return result
    } catch (err) {
      console.error('Failed to add bookmark:', err)
      setError('ブックマークの追加に失敗しました')
      throw err
    }
  }, [userId])

  const removeBookmark = useCallback(async (bookmarkedUserId: number) => {
    if (!userId) return

    try {
      setError(null)
      const result = await bookmarksApi.toggle(userId, bookmarkedUserId)
      
      if (!result.isBookmarked) {
        // ブックマークが削除された場合は再取得
        await fetchBookmarks()
      }
      
      return result
    } catch (err) {
      console.error('Failed to remove bookmark:', err)
      setError('ブックマークの削除に失敗しました')
      throw err
    }
  }, [userId])

  const isBookmarked = useCallback((bookmarkedUserId: number): boolean => {
    return bookmarks.some(bookmark => bookmark.bookmarked_user_id === bookmarkedUserId)
  }, [bookmarks])

  const toggleBookmark = useCallback(async (bookmarkedUserId: number) => {
    console.log('🔖 useBookmarks: toggleBookmark開始', { userId, bookmarkedUserId })
    
    if (!userId) {
      console.log('🔖 useBookmarks: userIdなし - スキップ')
      return
    }

    try {
      setError(null)
      console.log('🔖 useBookmarks: bookmarksApi.toggle呼び出し')
      const result = await bookmarksApi.toggle(userId, bookmarkedUserId)
      console.log('🔖 useBookmarks: toggle結果:', result)
      
      // ブックマーク一覧を再取得
      console.log('🔖 useBookmarks: ブックマーク一覧再取得開始')
      try {
        await fetchBookmarks()
        console.log('🔖 useBookmarks: ブックマーク一覧再取得完了')
      } catch (fetchError) {
        console.error('🔖 useBookmarks: ブックマーク一覧再取得でエラー:', fetchError)
      }
      
      return result
    } catch (err) {
      console.error('🔖 useBookmarks: Failed to toggle bookmark:', err)
      setError('ブックマークの更新に失敗しました')
      throw err
    }
  }, [userId])

  useEffect(() => {
    console.log('🔖 useBookmarks: useEffect実行', { autoFetch, userId })
    if (autoFetch && userId) {
      console.log('🔖 useBookmarks: fetchBookmarks呼び出し開始')
      fetchBookmarks().catch(err => {
        console.error('🔖 useBookmarks: useEffect内でfetchBookmarksエラー:', err)
      })
    }
  }, [autoFetch, userId]) // fetchBookmarksを依存配列から削除

  return {
    bookmarks,
    bookmarkedUsers,
    loading,
    error,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    refetch: fetchBookmarks
  }
}