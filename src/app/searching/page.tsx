import React from 'react'
import { AnimatedProgress } from '@/components/ui/animated-progress'

export default function Searching() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4 -mt-20">
        <AnimatedProgress />
      </div>
    </main>
  )
}
