import { getServerSession } from 'next-auth'
import { authOptions } from '@/features/auth/config/authOptions'
import { redirect } from 'next/navigation'
import HomeClientPage from './HomeClientPage'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return <HomeClientPage />
}
