'use client'
import React, { useEffect, useState } from 'react'
import ProfileCard from './components/profile-card'
import { profiles } from './components/profiles'

type Profile = (typeof profiles)[number]

export default function DemoPage() {
  // sessionStorageからデータ取得
  let profileData = null
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('aiResult')
    profileData = stored ? JSON.parse(stored) : null
  }

  console.log('Profile data from sessionStorage:', profileData)

  if (!profileData) return <div>データがありません</div>

  // APIから返されるデータ構造に応じて整形
  let cardProps
  if (profileData.data) {
    // 元の構造（user, analysis, repositories）
    const user = profileData.data.user
    const analysis = profileData.data.analysis
    cardProps = {
      name: user.name || user.username,
      bio: user.bio || '',
      skills: {
        hackathonCount: analysis?.hackathon_count || 0,
        strongRoles: analysis?.strong_roles || [],
        challengeRoles: analysis?.challenge_roles || [],
      },
      projects: {
        blog: user.blog || '',
        github: user.html_url || '',
      },
      github: {
        repositories: user.public_repos || 0,
        contributions: analysis?.contributions || 0,
        languages: analysis?.primary_languages || [],
        frameworks: analysis?.frameworks || [],
        achievements: analysis?.achievements || [],
        recentProjects: profileData.data.repositories?.map((repo: any) => repo.name) || [],
      },
    }
  } else {
    // 直接ProfileCardのProps形式で返される場合
    cardProps = profileData
  }

  console.log('Card props:', cardProps)

  const mainProfile = profiles[0];
  const otherProfiles = profiles.slice(1)

  // 追加: レスポンシブで表示個数を切り替え
  const [maxCards, setMaxCards] = useState(9)
  useEffect(() => {
    const updateMaxCards = () => {
      if (window.innerWidth < 1200) {
        setMaxCards(4)
      } else {
        setMaxCards(9)
      }
    }
    updateMaxCards()
    window.addEventListener('resize', updateMaxCards)
    return () => window.removeEventListener('resize', updateMaxCards)
  }, [])

  // 背景画像の切り替え（ループ）
  const [bgImage, setBgImage] = useState('/team.webp')
  const [fade, setFade] = useState(false)
  useEffect(() => {
    let current = '/team.webp'
    let timer: NodeJS.Timeout
    let fadeTimer: NodeJS.Timeout
    const loop = () => {
      timer = setTimeout(() => {
        setFade(true)
        fadeTimer = setTimeout(() => {
          current = current === '/team.webp' ? '/team2.webp' : '/team.webp'
          setBgImage(current)
          setFade(false)
          loop()
        }, 1000) // フェードアウト1秒
      }, 10000)
    }
    loop()
    return () => {
      clearTimeout(timer)
      clearTimeout(fadeTimer)
    }
  }, [])

  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* 背景画像 */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)',
        }}
      />
      {/* 白の半透明レイヤー */}
      <div className='absolute inset-0 z-10 bg-white/60' />
      {/* メインコンテンツ */}
      <div className='relative z-20 flex flex-col min-h-screen md:flex-row p-4 gap-4'>
        {/* メインのプロフィールカード（左側に1/2） */}
        <div className='w-full md:w-1/2 p-4'>
          <ProfileCard {...cardProps} />
        </div>
        {/* サブカード（右側に1/2、レスポンシブで個数可変） */}
        <div className='w-full md:w-1/2 grid grid-cols-2 grid-rows-2 xl:grid-cols-3 xl:grid-rows-3 gap-2 p-4'>
          {otherProfiles.slice(0, maxCards).map((profile: Profile, index: number) => (
            <ProfileCard
              key={index}
              name={profile.name}
              bio={profile.bio}
              skills={profile.skills}
              projects={profile.projects}
              github={profile.github}
              size='small'
            />
          ))}
          {otherProfiles.length > maxCards && (
            <div className='col-span-2 xl:col-span-3 row-start-3 flex items-center justify-center relative'>
              {otherProfiles
                .slice(maxCards, maxCards + 3)
                .map((profile: Profile, index: number) => (
                  <div key={index} className='blur-sm opacity-50 mx-1'>
                    <ProfileCard
                      name={profile.name}
                      bio={profile.bio}
                      skills={profile.skills}
                      projects={profile.projects}
                      github={profile.github}
                      size='small'
                    />
                  </div>
                ))}
              <button className='absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow hover:bg-[#37a34a] hover:text-white z-10 transition-colors'>
                もっと見る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

