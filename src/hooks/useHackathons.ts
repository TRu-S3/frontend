import { useEffect, useState } from "react"

export interface Hackathon {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  registration_start: string
  registration_deadline: string
  max_participants: number
  location: string
  organizer: string
  contact_email: string
  prize_info: string
  rules: string
  tech_stack: string
  status: string
  is_public: boolean
  banner_url: string
  website_url: string
  created_at: string
  updated_at: string
}

export function useHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://backend-696136807010.asia-northeast1.run.app/api/v1/hackathons')
      .then(res => res.json())
      .then(data => setHackathons(data.hackathons))
      .catch(() => setError('ハッカソンの取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  return { hackathons, loading, error }
} 