import { useEffect, useState } from 'react'
import { contestsApi, Contest } from '@/lib/api/contests'

export function useUserContests(userId?: number) {
  const [contests, setContests] = useState<Contest[]>([])
  useEffect(() => {
    if (!userId) return
    contestsApi.list({ author_id: userId }).then((res) => setContests(res.contests || []))
  }, [userId])
  return contests
}
