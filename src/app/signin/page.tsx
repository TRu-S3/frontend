import Login from '@/features/auth/ui/components/Login'
import { getSession } from '@/features/auth/config/auth'

export default async function SignInPage() {
  const session = await getSession()

  return <Login session={session} />
}
