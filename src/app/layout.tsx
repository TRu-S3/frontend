import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/features/auth/provider/SessionProvider'
import Header from '@/components/ui/header'
import { getSession } from '@/features/auth/config/auth'
import Footer from '@/components/ui/footer'
import QueryProvider from '@/lib/query-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  return (
    <SessionProvider>
      <QueryProvider>
        <html lang='en'>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className='min-h-screen flex flex-col'>
              <Header session={session} />
              <main className='flex-1 pt-16'>{children}</main>
              <Footer />
            </div>
          </body>
        </html>
      </QueryProvider>
    </SessionProvider>
  )
}
