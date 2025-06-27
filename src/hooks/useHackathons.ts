'use client'

import { useState, useEffect, useCallback } from 'react'
import { hackathonsApi, Hackathon } from '@/lib/api/hackathons'

interface UseHackathonsProps {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizer?: string
  isPublic?: boolean
  autoFetch?: boolean
}

export const useHackathons = ({ 
  status, 
  organizer, 
  isPublic, 
  autoFetch = true 
}: UseHackathonsProps = {}) => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHackathons = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await hackathonsApi.list({
        status,
        organizer,
        is_public: isPublic
      })
      setHackathons(response.hackathons)
    } catch (err) {
      console.error('Failed to fetch hackathons:', err)
      setError('ハッカソンの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [status, organizer, isPublic])

  const createHackathon = useCallback(async (hackathonData: Parameters<typeof hackathonsApi.create>[0]) => {
    try {
      setError(null)
      const newHackathon = await hackathonsApi.create(hackathonData)
      
      // 一覧を再取得
      await fetchHackathons()
      
      return newHackathon
    } catch (err) {
      console.error('Failed to create hackathon:', err)
      setError('ハッカソンの作成に失敗しました')
      throw err
    }
  }, [fetchHackathons])

  const updateHackathon = useCallback(async (id: number, hackathonData: Parameters<typeof hackathonsApi.update>[1]) => {
    try {
      setError(null)
      const updatedHackathon = await hackathonsApi.update(id, hackathonData)
      
      // 一覧を再取得
      await fetchHackathons()
      
      return updatedHackathon
    } catch (err) {
      console.error('Failed to update hackathon:', err)
      setError('ハッカソンの更新に失敗しました')
      throw err
    }
  }, [fetchHackathons])

  const deleteHackathon = useCallback(async (id: number) => {
    try {
      setError(null)
      await hackathonsApi.delete(id)
      
      // 一覧を再取得
      await fetchHackathons()
    } catch (err) {
      console.error('Failed to delete hackathon:', err)
      setError('ハッカソンの削除に失敗しました')
      throw err
    }
  }, [fetchHackathons])

  const getHackathonById = useCallback(async (id: number): Promise<Hackathon | null> => {
    try {
      setError(null)
      const hackathon = await hackathonsApi.getById(id)
      return hackathon
    } catch (err) {
      console.error('Failed to get hackathon by id:', err)
      setError('ハッカソンの詳細取得に失敗しました')
      return null
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchHackathons().catch(err => {
        console.error('useEffect fetchHackathons error:', err)
      })
    }
  }, [autoFetch, fetchHackathons])

  return {
    hackathons,
    loading,
    error,
    fetchHackathons,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    getHackathonById,
    refetch: fetchHackathons
  }
}
