'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import Popup from '@/components/ui/Popup'
import Login from '@/features/auth/ui/components/Login'
import { useSession } from 'next-auth/react'

interface ProfileData {
  name: string
  bio: string
  skills: {
    hackathonCount: number
    strongRoles: string[]
    challengeRoles: string[]
  }
  projects: {
    blog?: string
    github?: string
  }
  github: {
    repositories: number
    contributions: number
    languages: string[]
    frameworks: string[]
    achievements?: string[]
    recentProjects?: string[]
  }
}

interface ProfileCardProps extends ProfileData {
  size?: 'large' | 'small'
}

const LargeProfileCard = ({ name, bio, skills, projects, github }: ProfileData) => {
  const initial = name.charAt(0)
  return (
    <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-100'>
      <div className='flex items-start gap-6 mb-8'>
        <div className='flex items-center gap-4 flex-shrink-0'>
          <Avatar className='w-20 h-20 border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg'>
            <AvatarFallback className='text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white'>{initial}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{name}</h1>
            <div className='flex items-center gap-2 mt-1'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-sm text-gray-500'>オンライン</span>
            </div>
          </div>
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-gray-600 mb-4 leading-relaxed'>{bio}</p>
          <div className='flex flex-wrap gap-2'>
            {skills.strongRoles.map((role, index) => (
              <Tag key={index} variant='secondary' className='px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
                {role}
              </Tag>
            ))}
          </div>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        <div className='space-y-6'>
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2'>
              <span className='text-blue-600'>⚡</span>
              スキル
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>ハッカソン参加回数</span>
                <span className='text-lg font-bold text-blue-600'>{skills.hackathonCount}回</span>
              </div>
              <div>
                <p className='text-sm text-gray-600 mb-2'>得意な役割</p>
                <div className='flex flex-wrap gap-2'>
                  {skills.strongRoles.map((role, index) => (
                    <Tag key={index} variant='outline' className='px-3 py-1 bg-white border-blue-200 text-blue-700'>
                      {role}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <p className='text-sm text-gray-600 mb-2'>挑戦したい役割</p>
                <div className='flex flex-wrap gap-2'>
                  {skills.challengeRoles.map((role, index) => (
                    <Tag key={index} variant='outline' className='px-3 py-1 bg-white border-purple-200 text-purple-700'>
                      {role}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2'>
              <span className='text-green-600'>📊</span>
              GitHub
            </h3>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='text-center'>
                  <p className='text-sm text-gray-600 mb-1'>リポジトリ数</p>
                  <p className='text-2xl font-bold text-green-600'>{github.repositories}</p>
                </div>
                <div className='text-center'>
                  <p className='text-sm text-gray-600 mb-1'>コントリビューション</p>
                  <p className='text-2xl font-bold text-blue-600'>{github.contributions}</p>
                </div>
              </div>
              <div>
                <p className='text-sm text-gray-600 mb-2'>使用言語</p>
                <div className='flex flex-wrap gap-2'>
                  {github.languages.map((lang, index) => (
                    <Tag key={index} variant='outline' className='px-3 py-1 bg-white border-green-200 text-green-700'>
                      {lang}
                    </Tag>
                  ))}
                </div>
              </div>
              {github.frameworks && github.frameworks.length > 0 && (
                <div>
                  <p className='text-sm text-gray-600 mb-2'>フレームワーク</p>
                  <div className='flex flex-wrap gap-2'>
                    {github.frameworks.map((fw, index) => (
                      <Tag key={index} variant='outline' className='px-3 py-1 bg-white border-blue-200 text-blue-700'>
                        {fw}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2'>
            <span className='text-purple-600'>🔗</span>
            プロジェクト
          </h3>
          <div className='flex flex-wrap gap-4'>
            {projects.blog && (
              <Button variant='outline' className='px-6 py-2 bg-white border-purple-200 text-purple-700 hover:bg-purple-50' asChild>
                <a href={projects.blog} target='_blank' rel='noopener noreferrer'>
                  📝 ブログ
                </a>
              </Button>
            )}
            {projects.github && (
              <Button variant='outline' className='px-6 py-2 bg-white border-purple-200 text-purple-700 hover:bg-purple-50' asChild>
                <a href={projects.github} target='_blank' rel='noopener noreferrer'>
                  🐙 GitHub
                </a>
              </Button>
            )}
          </div>
        </div>

        {github.achievements && github.achievements.length > 0 && (
          <div className='bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2'>
              <span className='text-yellow-600'>🏆</span>
              実績
            </h3>
            <div className='flex flex-wrap gap-2'>
              {github.achievements.map((achievement, index) => (
                <Tag key={index} variant='secondary' className='px-4 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200 text-yellow-800'>
                  {achievement}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {github.recentProjects && github.recentProjects.length > 0 && (
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2'>
              <span className='text-indigo-600'>🚀</span>
              最近のプロジェクト
            </h3>
            <div className='flex flex-wrap gap-2'>
              {github.recentProjects.map((project, index) => (
                <Tag key={index} variant='outline' className='px-4 py-1.5 bg-white border-indigo-200 text-indigo-700'>
                  {project}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const SmallProfileCard = ({ name, bio, skills, projects, github }: ProfileData) => {
  const initial = name.charAt(0)
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (contentWrapperRef.current) {
        // 何もせず
      }
    }
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [])

  return (
    <div className='bg-white rounded-xl shadow-xl p-5 min-w-[180px] max-w-[240px] flex flex-col items-start text-xs h-full'>
      <div className='flex items-center gap-3 mb-2 w-full'>
        <Avatar className='w-12 h-12 border-2 border-white shadow'>
          <AvatarFallback className='text-base'>{initial}</AvatarFallback>
        </Avatar>
        <span className='text-base font-bold truncate'>{name}</span>
      </div>
      <div className='w-full flex flex-col items-start'>
        <p className='text-gray-500 text-xs mb-1 line-clamp-1 w-full'>{bio}</p>
        <div className='flex flex-wrap gap-1'>
          {skills.strongRoles.map((role, index) => (
            <Tag key={index} variant='secondary' className='px-2 py-0.5 text-[10px]'>
              {role}
            </Tag>
          ))}
        </div>
      </div>

      <div
        className='relative h-[140px] max-h-[140px] overflow-hidden w-full'
        ref={contentWrapperRef}
      >
        <div className='grid grid-cols-1 gap-2 w-full'>
          <div>
            <h3 className='font-semibold text-xs mb-1'>スキル</h3>
            <div className='flex flex-wrap gap-1 mb-1'>
              <span className='text-[11px] text-gray-500 mr-1'>ハッカソン:</span>
              <span className='text-[11px]'>{skills.hackathonCount}回</span>
            </div>
            <div className='flex flex-wrap gap-1 mb-1'>
              <span className='text-[11px] text-gray-500 mr-1'>得意:</span>
              {skills.strongRoles.map((role, i) => (
                <Tag key={i} variant='secondary' className='px-2 py-0.5 text-[10px]'>
                  {role}
                </Tag>
              ))}
            </div>
            <div className='flex flex-wrap gap-1 mb-1'>
              <span className='text-[11px] text-gray-500 mr-1'>挑戦:</span>
              {skills.challengeRoles.map((role, i) => (
                <Tag key={i} variant='outline' className='px-2 py-0.5 text-[10px]'>
                  {role}
                </Tag>
              ))}
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-xs mb-1'>GitHub</h3>
            <div className='flex flex-wrap gap-1 mb-1'>
              <span className='text-[11px] text-gray-500 mr-1'>リポジトリ:</span>
              <span className='text-[11px]'>{github.repositories}</span>
              <span className='text-[11px] text-gray-500 mr-1'>貢献:</span>
              <span className='text-[11px]'>{github.contributions}</span>
            </div>
            <div className='flex flex-wrap gap-1 mb-1'>
              <span className='text-[11px] text-gray-500 mr-1'>言語:</span>
              {github.languages.slice(0, 2).map((lang, i) => (
                <Tag key={i} variant='outline' className='px-2 py-0.5 text-[10px]'>
                  {lang}
                </Tag>
              ))}
            </div>
            {github.frameworks && (
              <div className='flex flex-wrap gap-1 mb-1'>
                <span className='text-[11px] text-gray-500 mr-1'>FW:</span>
                {github.frameworks.slice(0, 2).map((fw, i) => (
                  <Tag key={i} variant='outline' className='px-2 py-0.5 text-[10px]'>
                    {fw}
                  </Tag>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className='font-semibold text-xs mb-1'>プロジェクト</h3>
            <div className='flex flex-wrap gap-1'>
              {projects.blog && (
                <Button variant='outline' className='px-2 py-0.5 text-[10px] h-6 min-h-0' asChild>
                  <a href={projects.blog} target='_blank' rel='noopener noreferrer'>
                    ブログ
                  </a>
                </Button>
              )}
              {projects.github && (
                <Button variant='outline' className='px-2 py-0.5 text-[10px] h-6 min-h-0' asChild>
                  <a href={projects.github} target='_blank' rel='noopener noreferrer'>
                    GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 w-full h-10 pointer-events-none bg-gradient-to-t from-white to-transparent'></div>
        <Popup
          trigger={
            <button className='absolute bottom-2 left-1/2 -translate-x-1/2 z-50 text-xs bg-white border rounded px-2 py-1 shadow hover:bg-gray-100 cursor-pointer'>
              もっと見る
            </button>
          }
        >
          <div className='w-full min-h-[320px] flex items-center justify-center'>
            <Login session={session} />
          </div>
        </Popup>
      </div>
    </div>
  )
}

export default function ProfileCard({ size = 'large', ...props }: ProfileCardProps) {
  if (size === 'small') {
    return <SmallProfileCard {...props} />
  }
  return <LargeProfileCard {...props} />
}
