'use client'

import { useState } from 'react'
import { healthApi } from '@/lib/api/health'
import { bookmarksApi } from '@/lib/api/bookmarks'
import { usersApi } from '@/lib/api/users'

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<string>('')
  const [userTest, setUserTest] = useState<string>('')
  const [apiClientTest, setApiClientTest] = useState<string>('')
  const [bookmarkTest, setBookmarkTest] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const status = await healthApi.getStatus()
      setHealthStatus(`✅ 接続成功: ${JSON.stringify(status)}`)
    } catch (error) {
      setHealthStatus(`❌ 接続失敗: ${error}`)
    }
    setLoading(false)
  }

  const testUserApi = async () => {
    setLoading(true)
    try {
      console.log('🧪 Direct API test starting...')
      
      // Direct fetch test
      const response = await fetch('https://backend-696136807010.asia-northeast1.run.app/api/v1/users?limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('🧪 Direct fetch response:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('🧪 Direct fetch error:', errorText)
        setUserTest(`❌ Direct fetch失敗: ${response.status} ${errorText}`)
      } else {
        const data = await response.json()
        console.log('🧪 Direct fetch success:', data)
        setUserTest(`✅ Direct fetch成功: ${data.users?.length || 0}件のユーザーを取得`)
      }
    } catch (error) {
      console.error('🧪 Direct fetch exception:', error)
      setUserTest(`❌ Direct fetch例外: ${error}`)
    }
    setLoading(false)
  }

  const testApiClient = async () => {
    setLoading(true)
    try {
      console.log('🧪 API Client test starting...')
      
      const users = await usersApi.list({ limit: 5 })
      console.log('🧪 API Client success:', users)
      setApiClientTest(`✅ API Client成功: ${users.users?.length || 0}件のユーザーを取得`)
    } catch (error) {
      console.error('🧪 API Client error:', error)
      setApiClientTest(`❌ API Client失敗: ${error}`)
    }
    setLoading(false)
  }

  const testBookmarkApi = async () => {
    setLoading(true)
    try {
      const bookmarks = await bookmarksApi.list({ limit: 5 })
      setBookmarkTest(`✅ ブックマークAPI成功: ${bookmarks.bookmarks.length}件のブックマークを取得`)
    } catch (error) {
      setBookmarkTest(`❌ ブックマークAPI失敗: ${error}`)
    }
    setLoading(false)
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-4">
      <h3 className="text-lg font-bold">API接続テスト</h3>
      
      <div className="space-y-2">
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '接続中...' : 'ヘルスチェック'}
        </button>
        {healthStatus && (
          <div className="p-2 bg-white rounded text-sm">
            {healthStatus}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={testUserApi}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '接続中...' : 'Direct Fetch'}
        </button>
        {userTest && (
          <div className="p-2 bg-white rounded text-sm">
            {userTest}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={testApiClient}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? '接続中...' : 'API Client'}
        </button>
        {apiClientTest && (
          <div className="p-2 bg-white rounded text-sm">
            {apiClientTest}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={testBookmarkApi}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? '接続中...' : 'ブックマークAPI'}
        </button>
        {bookmarkTest && (
          <div className="p-2 bg-white rounded text-sm">
            {bookmarkTest}
          </div>
        )}
      </div>
    </div>
  )
}