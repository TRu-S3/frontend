'use client'

import { useGetHello } from '../api/use-get-hello'

const HelloExample = () => {
  const { data, isLoading, error } = useGetHello()

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div className='text-red-500'>エラーが発生しました: {error.message}</div>
  }

  return (
    <div className='p-4 border rounded-lg'>
      <h2 className='text-xl font-bold mb-2'>TanStack Query + Firebase Auth Example</h2>
      <p className='mb-2'>{data?.message}</p>

      {data?.user && (
        <div className='mt-4 p-3 bg-gray-100 rounded'>
          <h3 className='font-semibold mb-1'>認証済みユーザー情報:</h3>
          <p className='text-sm'>UID: {data.user.uid}</p>
          <p className='text-sm'>Email: {data.user.email}</p>
          <p className='text-sm'>Name: {data.user.name}</p>
        </div>
      )}
    </div>
  )
}

export default HelloExample
