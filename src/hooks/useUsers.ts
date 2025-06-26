'use client'

import { useState, useEffect, useCallback } from 'react'
import { usersApi, User, UsersListResponse } from '@/lib/api/users'

interface UseUsersProps {
  autoFetch?: boolean
  filters?: {
    name?: string
    gmail?: string
    page?: number
    limit?: number
  }
}

export const useUsers = ({ autoFetch = true, filters }: UseUsersProps = {}) => {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<UsersListResponse['pagination'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (params?: typeof filters) => {
    try {
      console.log('🎯 useUsers: fetchUsers開始')
      setLoading(true)
      setError(null)
      
      console.log('🎯 useUsers: usersApi.list呼び出し中...')
      const response = await usersApi.list(params || filters)
      console.log('🎯 useUsers: usersApi.listレスポンス:', response)
      
      setUsers(response.users)
      setPagination(response.pagination)
      console.log('🎯 useUsers: 状態更新完了 - ユーザー数:', response.users?.length)
    } catch (err) {
      console.error('🎯 useUsers: Failed to fetch users:', err)
      setError('ユーザー一覧の取得に失敗しました')
    } finally {
      console.log('🎯 useUsers: ローディング終了')
      setLoading(false)
    }
  }, []) // filtersを依存配列から削除

  const createUser = useCallback(async (userData: { name: string; gmail: string; icon_url?: string }) => {
    try {
      setError(null)
      const newUser = await usersApi.create(userData)
      
      // 作成後に一覧を再取得
      await fetchUsers()
      
      return newUser
    } catch (err) {
      console.error('Failed to create user:', err)
      setError('ユーザーの作成に失敗しました')
      throw err
    }
  }, [fetchUsers])

  const updateUser = useCallback(async (id: number, userData: { name?: string; gmail?: string; icon_url?: string }) => {
    try {
      setError(null)
      const updatedUser = await usersApi.update(id, userData)
      
      // 更新後に一覧を再取得
      await fetchUsers()
      
      return updatedUser
    } catch (err) {
      console.error('Failed to update user:', err)
      setError('ユーザーの更新に失敗しました')
      throw err
    }
  }, [fetchUsers])

  const deleteUser = useCallback(async (id: number) => {
    try {
      setError(null)
      await usersApi.delete(id)
      
      // 削除後に一覧を再取得
      await fetchUsers()
    } catch (err) {
      console.error('Failed to delete user:', err)
      setError('ユーザーの削除に失敗しました')
      throw err
    }
  }, [fetchUsers])

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.page * pagination.limit >= pagination.total) return

    try {
      setLoading(true)
      setError(null)
      
      const nextPage = pagination.page + 1
      const response = await usersApi.list({ ...filters, page: nextPage })
      
      setUsers(prev => [...prev, ...response.users])
      setPagination(response.pagination)
    } catch (err) {
      console.error('Failed to load more users:', err)
      setError('追加のユーザー読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }, [pagination])

  const searchUsers = useCallback(async (searchParams: { name?: string; gmail?: string }) => {
    await fetchUsers({ ...filters, ...searchParams, page: 1 })
  }, [fetchUsers])

  useEffect(() => {
    if (autoFetch && typeof window !== 'undefined') {
      fetchUsers()
    }
  }, [autoFetch, fetchUsers])

  return {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    loadMore,
    searchUsers,
    refetch: fetchUsers,
    hasMore: pagination ? pagination.page * pagination.limit < pagination.total : false
  }
}