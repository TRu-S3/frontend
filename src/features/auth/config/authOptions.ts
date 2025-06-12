import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { auth } from '@/features/auth/firebase/admin'

// NextAuthの型を拡張
declare module 'next-auth' {
  interface User {
    id: string
    uid: string
    emailVerified?: boolean
  }
  interface Session {
    user: {
      id: string
      uid: string
      name?: string | null
      email?: string | null
      image?: string | null
      emailVerified?: boolean
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        idToken: { type: 'text' },
      },
      authorize: async (credentials) => {
        const idToken = credentials?.idToken
        if (!idToken) return null
        if (idToken) {
          try {
            // Firebase Admin SDKでidTokenを検証
            const decoded = await auth.verifyIdToken(idToken)

            return {
              id: decoded.uid,
              uid: decoded.uid,
              name: decoded.name,
              email: decoded.email,
              image: decoded.picture,
              emailVerified: decoded.email_verified,
            }
          } catch (err) {
            console.error('Firebase token verification failed:', err)
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.uid as string
        session.user.uid = token.uid as string
        session.user.emailVerified = token.emailVerified as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
}
