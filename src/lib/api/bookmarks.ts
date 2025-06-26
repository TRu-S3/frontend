'use client'

import { apiClient } from '@/lib/api-client'
import { User } from './users'

// ブックマーク型定義
export interface Bookmark {
  id: number
  user_id: number
  bookmarked_user_id: number
  created_at: string
  User?: User
  BookmarkedUser?: User
  bookmarked_user?: User  // バックエンドのレスポンス形式に合わせて追加
}

export interface CreateBookmarkRequest {
  user_id: number
  bookmarked_user_id: number
}

export interface BookmarksListResponse {
  bookmarks: Bookmark[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// ブックマーク管理API
export const bookmarksApi = {
  // ブックマーク作成
  async create(data: CreateBookmarkRequest): Promise<Bookmark> {
    return await apiClient.post<Bookmark>('/api/v1/bookmarks', data)
  },

  // ブックマーク一覧取得
  async list(params?: {
    page?: number
    limit?: number
    user_id?: number
  }): Promise<BookmarksListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.user_id) searchParams.set('user_id', params.user_id.toString())

    const endpoint = `/api/v1/bookmarks${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await apiClient.get<BookmarksListResponse>(endpoint, false) // 認証なし
  },

  // 特定ユーザーのブックマーク一覧取得
  async getUserBookmarks(userId: number, params?: {
    page?: number
    limit?: number
  }): Promise<BookmarksListResponse> {
    return await this.list({ ...params, user_id: userId })
  },

  // ブックマーク更新
  async update(id: number, data: Partial<CreateBookmarkRequest>): Promise<Bookmark> {
    return await apiClient.put<Bookmark>(`/api/v1/bookmarks/${id}`, data)
  },

  // ブックマーク削除
  async delete(id: number): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`/api/v1/bookmarks/${id}`)
  },

  // ユーザーが特定のユーザーをブックマークしているかチェック
  async isBookmarked(userId: number, bookmarkedUserId: number): Promise<boolean> {
    try {
      const response = await this.getUserBookmarks(userId)
      return response.bookmarks.some(
        bookmark => bookmark.bookmarked_user_id === bookmarkedUserId
      )
    } catch (error) {
      console.error('Failed to check bookmark status:', error)
      return false
    }
  },

  // ブックマークを追加または削除（トグル）
  async toggle(userId: number, bookmarkedUserId: number): Promise<{ isBookmarked: boolean; bookmark?: Bookmark }> {
    try {
      // 既存のブックマークを検索
      const bookmarks = await this.getUserBookmarks(userId)
      
      const existingBookmark = bookmarks.bookmarks.find(
        bookmark => bookmark.bookmarked_user_id === bookmarkedUserId
      )

      if (existingBookmark) {
        // ブックマークが存在する場合は削除
        await this.delete(existingBookmark.id)
        return { isBookmarked: false }
      } else {
        // ブックマークが存在しない場合は作成
        const newBookmark = await this.create({
          user_id: userId,
          bookmarked_user_id: bookmarkedUserId
        })
        return { isBookmarked: true, bookmark: newBookmark }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
      throw error
    }
  },

  // ブックマークされたユーザーの詳細情報を含む一覧取得
  async getBookmarkedUsersWithDetails(userId: number, params?: {
    page?: number
    limit?: number
  }): Promise<User[]> {
    try {
      const response = await this.getUserBookmarks(userId, params)
      
      // ブックマークされたユーザーの情報のみを返す
      const users = response.bookmarks
        .filter(bookmark => bookmark.bookmarked_user || bookmark.BookmarkedUser)
        .map(bookmark => bookmark.bookmarked_user || bookmark.BookmarkedUser!)
      
      return users
    } catch (error) {
      console.error('Failed to get bookmarked users with details:', error)
      return []
    }
  }
}