'use client'

import React, { useState } from 'react'
import Popup from '@/components/ui/Popup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

interface MatchingPopupProps {
  trigger?: React.ReactNode
}

export default function MatchingPopup({ trigger }: MatchingPopupProps) {
  const [ogp, setOgp] = useState('')
  const [hackathonName, setHackathonName] = useState('')
  const [period, setPeriod] = useState('')
  const [positions, setPositions] = useState<Record<string, number>>({
    front: 0,
    back: 0,
    designer: 0,
    infra: 0,
    manager: 0,
  })
  const [deadline, setDeadline] = useState('')
  const [purpose, setPurpose] = useState('')
  const [message, setMessage] = useState('')
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [newRole, setNewRole] = useState('')

  return (
    <Popup
      trigger={
        trigger || <Button className='w-full max-w-xs mx-auto'>マッチングを新規で募集する</Button>
      }
      title='マッチングを新規で募集する'
    >
      <form className='flex flex-col gap-4 w-full max-w-[900px] px-9 mx-auto'>
        {/* OGP画像・ハッカソン名・期間 */}
        <div className='flex flex-col gap-2 mb-2'>
          <label className='font-bold text-sm'>URL</label>
          <Input
            type='text'
            placeholder='OGP画像URL'
            value={ogp}
            onChange={(e) => setOgp(e.target.value)}
            className='w-full'
          />
          {ogp && (
            <Image
              src={ogp}
              alt='OGP'
              width={600}
              height={128}
              className='w-full h-32 object-cover rounded border'
            />
          )}
          <label className='font-bold text-sm'>ハッカソン名 / 開発期間 / etc...</label>
          <Input
            type='text'
            placeholder='ハッカソン名 / 開発期間 / etc...'
            value={hackathonName}
            onChange={(e) => setHackathonName(e.target.value)}
            className='w-full'
          />
          <label className='font-bold text-sm'>ハッカソン実施期間</label>
          <Input
            type='text'
            placeholder='ハッカソン実施期間'
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className='w-full'
          />
        </div>
        {/* 募集人数（枠で囲み、1行横並び、ラベル14px、自由追加） */}
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2'>
          <div className='font-bold mb-2 text-base'>募集人数</div>
          <div className='flex flex-row gap-8 items-center flex-wrap'>
            {/* デフォルト役割 */}
            {[
              { key: 'front', label: 'フロントエンド' },
              { key: 'back', label: 'バックエンド' },
            ].map((role) => (
              <div key={role.key} className='flex items-center gap-3 mb-2'>
                <span className='font-semibold text-[14px]'>{role.label}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    setPositions((p) => ({
                      ...p,
                      [role.key]: Math.max(0, positions[role.key] || 0 - 1),
                    }))
                  }
                >
                  -
                </Button>
                <span className='w-6 text-center text-[14px]'>{positions[role.key] || 0}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    setPositions((p) => ({ ...p, [role.key]: (positions[role.key] || 0) + 1 }))
                  }
                >
                  +
                </Button>
              </div>
            ))}
            {/* カスタム役割 */}
            {customRoles.map((role, idx) => (
              <div key={role} className='flex items-center gap-3 mb-2'>
                <span className='font-semibold text-[14px]'>{role}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    setPositions((p) => ({ ...p, [role]: Math.max(0, positions[role] || 0 - 1) }))
                  }
                >
                  -
                </Button>
                <span className='w-6 text-center text-[14px]'>{positions[role] || 0}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    setPositions((p) => ({ ...p, [role]: (positions[role] || 0) + 1 }))
                  }
                >
                  +
                </Button>
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  onClick={() => {
                    setCustomRoles((r) => r.filter((_, i) => i !== idx))
                    setPositions((p) => {
                      const newP = { ...p }
                      delete newP[role]
                      return newP
                    })
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
            {/* 役割追加欄 */}
            <div className='flex items-center gap-2 mb-2'>
              <Input
                type='text'
                placeholder='役割を追加 (例: PM, QA)'
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className='w-32 text-[14px]'
              />
              <Button
                type='button'
                size='sm'
                variant='secondary'
                disabled={!newRole.trim() || customRoles.includes(newRole.trim())}
                onClick={() => {
                  if (newRole.trim() && !customRoles.includes(newRole.trim())) {
                    setCustomRoles((r) => [...r, newRole.trim()])
                    setNewRole('')
                  }
                }}
              >
                追加
              </Button>
            </div>
          </div>
        </div>
        {/* 募集掲載期日 */}
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-sm'>募集掲載期日</label>
          <Input
            type='date'
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className='w-full'
          />
        </div>
        {/* 目的 */}
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-sm'>目的</label>
          <Input
            type='text'
            placeholder='目的 例: 新しいものを作りたい的な？'
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className='w-full'
          />
        </div>
        {/* メッセージ */}
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-sm'>メッセージ</label>
          <Textarea
            placeholder='ex: バックエンドとフロントエンドの人を募集しています'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='min-h-[120px] w-full'
          />
        </div>
        {/* 募集開始ボタン */}
        <Button
          type='submit'
          className='w-full font-bold mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          size='default'
          variant='default'
        >
          募集開始！
        </Button>
      </form>
    </Popup>
  )
}
