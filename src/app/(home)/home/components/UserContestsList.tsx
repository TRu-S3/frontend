import { useState } from 'react'
import RecruitingHackathonCard from './RecruitingHackathonCard'
import { Contest } from '@/lib/api/contests'

export default function UserContestsList({ contests }: { contests: Contest[] }) {
  const [showAll, setShowAll] = useState(false)
  if (!contests.length) return null
  const displayContests = showAll ? contests : contests.slice(0, 2)
  return (
    <div className={`mt-6 space-y-4 relative ${!showAll ? 'max-h-[500px] overflow-hidden' : ''}`}>
      <div className='font-bold text-gray-700 mb-2'>このユーザーの募集</div>
      {displayContests.map((contest) => (
        <RecruitingHackathonCard
          key={contest.id}
          name={contest.title || 'ハッカソン名'}
          registrationDeadline={contest.application_deadline}
          message={contest.message}
          websiteUrl={contest.website_url}
          backend_quota={contest.backend_quota}
          frontend_quota={contest.frontend_quota}
          ai_quota={contest.ai_quota}
        />
      ))}
      {contests.length > 2 && !showAll && (
        <>
          <div
            className='absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none'
            role='presentation'
          ></div>
          <button
            onClick={() => setShowAll(true)}
            className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-xs bg-white border rounded px-4 py-2 shadow hover:bg-gray-100 cursor-pointer'
            aria-label='もっと見る'
          >
            もっと見る
          </button>
        </>
      )}
    </div>
  )
}
