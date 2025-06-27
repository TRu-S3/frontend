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
    if (!userId) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // ブックマーク一覧を取得
      const response = await bookmarksApi.getUserBookmarks(userId)
      setBookmarks(response.bookmarks)

      // ブックマークされたユーザーの詳細情報を取得
      const users = await bookmarksApi.getBookmarkedUsersWithDetails(userId)
      setBookmarkedUsers(users)
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err)
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
    if (!userId) {
      return
    }

    try {
      setError(null)
      const result = await bookmarksApi.toggle(userId, bookmarkedUserId)
      
      // ブックマーク一覧を再取得
      await fetchBookmarks()
      
      return result
    } catch (err) {
      console.error('Failed to toggle bookmark:', err)
      setError('ブックマークの更新に失敗しました')
      throw err
    }
  }, [userId, fetchBookmarks])

  useEffect(() => {
    if (autoFetch && userId) {
      fetchBookmarks().catch(err => {
        console.error('useEffect fetchBookmarks error:', err)
      })
    }
  }, [autoFetch, userId, fetchBookmarks])

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