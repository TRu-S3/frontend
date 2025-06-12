import Login from '@/features/auth/ui/components/Login'
import { getSession } from '@/features/auth/config/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await getSession()

  if (session) {
    redirect('/')
  }

  return <Login session={session} />
}
