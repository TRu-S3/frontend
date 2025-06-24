import React from 'react'
import ProfileCard from './components/profile-card'
import { profiles } from './components/profiles'

type Profile = typeof profiles[number]

export default function DemoPage() {
  const mainProfile = profiles[0]
  const otherProfiles = profiles.slice(1)

  return (
    <div className='flex flex-col md:flex-row p-4 gap-4'>
      {/* メインのプロフィールカード（左側に1/2） */}
      <div className='w-full md:w-1/2 p-4'>
        <ProfileCard
          name={mainProfile.name}
          bio={mainProfile.bio}
          skills={mainProfile.skills}
          projects={mainProfile.projects}
          github={mainProfile.github}
        />
      </div>

      {/* サブカード（右側に1/2、3枚まで小さく表示。4枚目以降はぼかし＋もっと見る） */}
      <div className="w-full md:w-1/2 grid grid-cols-3 grid-rows-3 gap-2 p-4">
        {otherProfiles.slice(0, 9).map((profile: Profile, index: number) => (
          <ProfileCard
            key={index}
            name={profile.name}
            bio={profile.bio}
            skills={profile.skills}
            projects={profile.projects}
            github={profile.github}
            size="small"
          />
        ))}
        {otherProfiles.length > 9 && (
          <div className="col-span-3 row-start-4 flex items-center justify-center relative">
            {otherProfiles.slice(9, 12).map((profile: Profile, index: number) => (
              <div key={index} className="blur-sm opacity-50 mx-1">
                <ProfileCard
                  name={profile.name}
                  bio={profile.bio}
                  skills={profile.skills}
                  projects={profile.projects}
                  github={profile.github}
                  size="small"
                />
              </div>
            ))}
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow hover:bg-gray-100 z-10">もっと見る</button>
          </div>
        )}
      </div>
    </div>
  )
}
