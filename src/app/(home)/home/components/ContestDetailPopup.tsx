'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, User, Target, MessageSquare, Users, Globe, Mail } from 'lucide-react'
import { Contest } from '@/lib/api/contests'
import { usersApi, User as UserType } from '@/lib/api/users'
import Image from 'next/image'

interface ContestDetailPopupProps {
  contest: Contest | null
  isOpen: boolean
  onClose: () => void
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '未設定'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '未設定'
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ContestDetailPopup: React.FC<ContestDetailPopupProps> = ({ contest, isOpen, onClose }) => {
  const [author, setAuthor] = useState<UserType | null>(null)
  const [authorLoading, setAuthorLoading] = useState(false)

  useEffect(() => {
    if (contest?.author_id && isOpen) {
      setAuthorLoading(true)
      usersApi
        .getById(contest.author_id)
        .then((user) => {
          setAuthor(user)
        })
        .catch((error) => {
          console.error('投稿者情報の取得に失敗:', error)
          setAuthor(null)
        })
        .finally(() => {
          setAuthorLoading(false)
        })
    } else {
      setAuthor(null)
    }
  }, [contest?.author_id, isOpen])

  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[64vw] max-w-none min-w-[400px] max-h-[90vh] overflow-y-auto p-8'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-900'>
            {contest.title || 'ハッカソン名'}
          </DialogTitle>
          <div className='flex items-center gap-2 mt-2'>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                contest.status === 'upcoming'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {contest.status === 'upcoming' ? '募集中' : contest.status}
            </span>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* ハッカソンの説明 */}
          {contest.description ? (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <MessageSquare className='w-4 h-4 text-blue-600' />
                <h3 className='font-semibold text-gray-800 text-base'>ハッカソンの説明</h3>
              </div>
              <p className='text-gray-700 leading-relaxed whitespace-pre-wrap text-sm'>
                {contest.description}
              </p>
            </div>
          ) : (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <MessageSquare className='w-4 h-4 text-gray-400' />
                <h3 className='font-semibold text-gray-500 text-base'>ハッカソンの説明</h3>
              </div>
              <p className='text-gray-500 italic text-sm'>説明</p>
            </div>
          )}

          {/* 目的 */}
          {contest.purpose && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Target className='w-4 h-4 text-purple-600' />
                <h3 className='font-semibold text-gray-800 text-base'>目的</h3>
              </div>
              <p className='text-gray-700 leading-relaxed text-sm'>{contest.purpose}</p>
            </div>
          )}

          {/* 募集メッセージ */}
          {contest.message && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <MessageSquare className='w-4 h-4 text-green-600' />
                <h3 className='font-semibold text-gray-800 text-base'>募集メッセージ</h3>
              </div>
              <p className='text-gray-700 leading-relaxed whitespace-pre-wrap text-sm'>
                {contest.message}
              </p>
            </div>
          )}

          {/* 募集役割 */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <Users className='w-4 h-4 text-orange-600' />
              <h3 className='font-semibold text-gray-800 text-base'>募集役割</h3>
            </div>
            <div className='space-y-2'>
              {typeof contest.frontend_quota === 'number' && contest.frontend_quota > 0 && (
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-700 text-sm'>フロントエンドエンジニア</span>
                  <span className='font-medium text-blue-600 text-sm'>
                    {contest.frontend_quota}名
                  </span>
                </div>
              )}
              {typeof contest.backend_quota === 'number' && contest.backend_quota > 0 && (
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-700 text-sm'>バックエンドエンジニア</span>
                  <span className='font-medium text-green-600 text-sm'>
                    {contest.backend_quota}名
                  </span>
                </div>
              )}
              {typeof contest.ai_quota === 'number' && contest.ai_quota > 0 && (
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-700 text-sm'>AIエンジニア</span>
                  <span className='font-medium text-purple-600 text-sm'>{contest.ai_quota}名</span>
                </div>
              )}
              {(!contest.frontend_quota || contest.frontend_quota === 0) &&
                (!contest.backend_quota || contest.backend_quota === 0) &&
                (!contest.ai_quota || contest.ai_quota === 0) && (
                  <p className='text-gray-500 text-sm'>募集役割は未設定です</p>
                )}
            </div>
          </div>

          {/* 期間情報 */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <Calendar className='w-4 h-4 text-red-600' />
              <h3 className='font-semibold text-gray-800 text-base'>期間情報</h3>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-gray-700 text-sm'>開始期間</span>
                <span className='font-medium text-sm'>{formatDate(contest.start_time)}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-gray-700 text-sm'>終了期間</span>
                <span className='font-medium text-sm'>{formatDate(contest.end_time)}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-gray-700 font-medium text-sm'>応募締切</span>
                <span className='font-medium text-red-600 text-sm'>
                  {formatDate(contest.application_deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* 投稿者情報 */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <User className='w-4 h-4 text-blue-600' />
              <h3 className='font-semibold text-gray-800 text-base'>投稿者情報</h3>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center gap-4'>
                {author?.icon_url && (
                  <Image
                    src={author.icon_url}
                    alt='投稿者アイコン'
                    width={40}
                    height={40}
                    className='w-10 h-10 rounded-full'
                  />
                )}
                <div className='flex-1'>
                  {authorLoading ? (
                    <div className='text-gray-500 text-sm'>読み込み中...</div>
                  ) : author ? (
                    <div className='space-y-1'>
                      <div className='font-medium text-gray-800 text-sm'>{author.name}</div>
                      <div className='flex items-center gap-2 text-xs text-gray-600'>
                        <Mail className='w-3 h-3' />
                        <span>{author.gmail}</span>
                      </div>
                    </div>
                  ) : (
                    <div className='text-gray-500 text-sm'>投稿者情報を取得できませんでした</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 外部リンク */}
          {contest.website_url && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Globe className='w-4 h-4 text-green-600' />
                <h3 className='font-semibold text-gray-800 text-base'>外部リンク</h3>
              </div>
              <Button
                variant='outline'
                onClick={() => window.open(contest.website_url, '_blank')}
                className='w-full'
              >
                <Globe className='w-4 h-4 mr-2' />
                ハッカソンサイトを開く
              </Button>
            </div>
          )}

          {/* 作成・更新日時 */}
          <div className='pt-4 border-t border-gray-200'>
            <div className='flex justify-between text-xs text-gray-500'>
              <div>作成日: {formatDate(contest.created_at)}</div>
              <div>更新日: {formatDate(contest.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-6'>
          <Button variant='outline' onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ContestDetailPopup
