'use client'

import React, { useState, useEffect, useReducer } from 'react'
import Popup from '@/components/ui/Popup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Confetti } from '@/components/ui/confetti'

/**
 * ハッカソン情報の型だよん
 */
interface HackathonInfo {
  name: string
  url: string
  description?: string
}

/**
 * MatchingPopupのprops型だよん
 * @property trigger - モーダルを開くトリガーだよん
 * @property open - モーダルの開閉状態を外部から制御する場合に使うよん
 * @property onOpenChange - モーダルの開閉状態を外部から制御する場合のコールバックだよん
 * @property initialHackathonName - 初期表示するハッカソン名だよん
 * @property recommendedHackathons - プルダウンで選択できるハッカソン情報の配列だよん
 */
interface MatchingPopupProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialHackathonName?: string
  recommendedHackathons?: HackathonInfo[]
}

/**
 * マッチング募集用のポップアップフォームだよん
 */
export default function MatchingPopup({
  trigger,
  open,
  onOpenChange,
  initialHackathonName,
  recommendedHackathons,
}: MatchingPopupProps) {
  /**
   * フォームの状態を一元管理するreducerだよん
   */
  type FormState = {
    hackathonName: string
    ogp: string
    period: string
    positions: Record<string, number>
    deadline: string
    purpose: string
    message: string
    customRoles: string[]
    newRole: string
    // description?: string // 使う場合は追加
  }
  type FormAction =
    | { type: 'SET_ALL'; payload: Partial<FormState> }
    | { type: 'RESET'; payload?: Partial<FormState> }
    | { type: 'UPDATE'; payload: Partial<FormState> }

  const getInitialFormState = (hackathonName?: string): FormState => ({
    hackathonName: hackathonName || '',
    ogp: '',
    period: '',
    positions: { front: 0, back: 0, ai: 0, designer: 0, infra: 0, manager: 0 },
    deadline: '',
    purpose: '',
    message: '',
    customRoles: [],
    newRole: '',
  })
  function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case 'SET_ALL':
        return { ...state, ...action.payload }
      case 'RESET':
        return { ...getInitialFormState(action.payload?.hackathonName), ...action.payload }
      case 'UPDATE':
        return { ...state, ...action.payload }
      default:
        return state
    }
  }
  const [form, dispatch] = useReducer(formReducer, getInitialFormState())
  const [loading, setLoading] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [showAddRoleInput, setShowAddRoleInput] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  /**
   * 合計人数をメモ化してパフォーマンスを向上させるよん
   */
  const totalPositions = React.useMemo(
    () => Object.values(form.positions).reduce((sum, count) => sum + count, 0),
    [form.positions]
  )

  /**
   * propsの変化（初回マウントやundefined→defined）でフォームを初期化・リセットするよん
   */
  useEffect(() => {
    if (initialHackathonName !== undefined) {
      const selected = recommendedHackathons?.find((h) => h.name === initialHackathonName)
      dispatch({
        type: 'SET_ALL',
        payload: {
          hackathonName: initialHackathonName,
          ogp: selected?.url || '',
        },
      })
    } else {
      dispatch({ type: 'RESET' })
    }
  }, [initialHackathonName, recommendedHackathons])

  /**
   * モーダルの開閉状態が変わったとき、エフェクトもリセットするよん
   */
  useEffect(() => {
    const isOpen = open === undefined ? popupOpen : open
    if (!isOpen) {
      setShowCelebration(false)
      setShowAddRoleInput(false)
      setLoading(false)
    }
  }, [open, popupOpen])

  /**
   * エフェクト表示時、4秒後に自動で非表示にするよん
   */
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  /**
   * フォームリセットの共通処理だよん
   */
  const resetForm = React.useCallback(() => {
    if (initialHackathonName !== undefined) {
      const selected = recommendedHackathons?.find((h) => h.name === initialHackathonName)
      dispatch({
        type: 'SET_ALL',
        payload: {
          hackathonName: initialHackathonName,
          ogp: selected?.url || '',
          period: '',
          positions: { front: 0, back: 0, ai: 0, designer: 0, infra: 0, manager: 0 },
          deadline: '',
          purpose: '',
          message: '',
          customRoles: [],
          newRole: '',
        },
      })
    } else {
      dispatch({ type: 'RESET' })
    }
  }, [initialHackathonName, recommendedHackathons])

  /**
   * フォーム送信時の処理だよん
   * バックエンド送信（コメントアウト中）→モーダルを閉じてエフェクト表示→フォームリセット
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // バックエンド連携は一旦コメントアウト
      // const res = await fetch('/api/matching', { ... })
      // TODO: バリデーション追加
      // if (!form.hackathonName || !form.deadline) {
      //   throw new Error('必須項目が未入力です')
      // }

      if (onOpenChange) {
        onOpenChange(false)
      } else {
        setPopupOpen(false)
      }
      setShowCelebration(true)
      resetForm()
    } catch (error) {
      console.error('送信エラー:', error)
      // TODO: エラー表示UIを追加
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popup
      trigger={
        trigger || <Button className='w-full max-w-xs mx-auto'>マッチングを新規で募集する</Button>
      }
      title='マッチングを新規で募集する'
      open={open === undefined ? popupOpen : open}
      onOpenChange={
        onOpenChange ||
        ((open) => {
          setPopupOpen(open)
          if (!open) {
            setShowCelebration(false)
            setShowAddRoleInput(false)
            setLoading(false)
          }
        })
      }
    >
      <form
        className='flex flex-col gap-4 w-full max-w-[900px] px-9 mx-auto'
        onSubmit={handleSubmit}
      >
        {/* モーダル外の演出 */}
        {typeof window !== 'undefined' &&
          showCelebration &&
          createPortal(
            <div className='fixed inset-0 z-[9999] flex flex-col justify-center items-center pointer-events-none'>
              <div className='absolute inset-0 bg-black/60' />
              <Confetti isActive={true} />
              <div className='relative text-4xl font-extrabold text-white drop-shadow-2xl bg-blue-700/90 rounded-2xl px-12 py-8'>
                募集を開始しました！
              </div>
            </div>,
            document.body
          )}
        {/* OGP画像・ハッカソン名・期間 */}
        <div className='flex flex-col gap-2 mb-2'>
          <label className='font-bold text-sm'>ハッカソン選択</label>
          <select
            className='w-full border rounded-md px-3 py-2 text-base'
            value={form.hackathonName}
            onChange={(e) => {
              const selected = recommendedHackathons?.find((h) => h.name === e.target.value)
              dispatch({
                type: 'UPDATE',
                payload: {
                  hackathonName: selected?.name || '',
                  ogp: selected?.url || '',
                  // description: selected?.description || '',
                },
              })
            }}
          >
            <option value=''>選択してください</option>
            {recommendedHackathons?.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
          <label className='font-bold text-sm'>ハッカソン実施期間</label>
          <Input
            type='text'
            placeholder='ハッカソン実施期間'
            value={form.period}
            onChange={(e) => dispatch({ type: 'UPDATE', payload: { period: e.target.value } })}
            className='w-full'
          />
        </div>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <div className='font-bold text-base'>募集人数</div>
              <span className='text-sm font-semibold text-blue-600'>合計: {totalPositions}人</span>
            </div>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              onClick={() => setShowAddRoleInput((v) => !v)}
            >
              <Plus className='w-5 h-5' />
            </Button>
          </div>
          <div className='flex flex-row gap-8 items-center flex-wrap'>
            {/* デフォルト役割 */}
            {[
              { key: 'front', label: 'フロントエンド' },
              { key: 'back', label: 'バックエンド' },
              { key: 'ai', label: 'AIエンジニア' },
            ].map((role) => (
              <div key={role.key} className='flex items-center gap-3 mb-2'>
                <span className='font-semibold text-[14px]'>{role.label}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE',
                      payload: {
                        positions: {
                          ...form.positions,
                          [role.key]: Math.max(0, (form.positions[role.key] || 0) - 1),
                        },
                      },
                    })
                  }
                  disabled={form.positions[role.key] === 0}
                >
                  -
                </Button>
                <span className='w-6 text-center text-[14px]'>{form.positions[role.key] || 0}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE',
                      payload: {
                        positions: {
                          ...form.positions,
                          [role.key]: (form.positions[role.key] || 0) + 1,
                        },
                      },
                    })
                  }
                >
                  +
                </Button>
              </div>
            ))}
            {/* カスタム役割 */}
            {form.customRoles.map((role, idx) => (
              <div key={role} className='flex items-center gap-3 mb-2'>
                <span className='font-semibold text-[14px]'>{role}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE',
                      payload: {
                        positions: {
                          ...form.positions,
                          [role]: Math.max(0, (form.positions[role] || 0) - 1),
                        },
                      },
                    })
                  }
                >
                  -
                </Button>
                <span className='w-6 text-center text-[14px]'>{form.positions[role] || 0}</span>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE',
                      payload: {
                        positions: {
                          ...form.positions,
                          [role]: (form.positions[role] || 0) + 1,
                        },
                      },
                    })
                  }
                >
                  +
                </Button>
                <Button
                  type='button'
                  size='icon'
                  variant='ghost'
                  onClick={() => {
                    dispatch({
                      type: 'UPDATE',
                      payload: {
                        customRoles: form.customRoles.filter((_, i) => i !== idx),
                        positions: Object.fromEntries(
                          Object.entries(form.positions).filter(([k]) => k !== role)
                        ),
                      },
                    })
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
            {/* 役割追加欄（＋ボタンで表示） */}
            {showAddRoleInput && (
              <div className='flex items-center gap-2 mb-2'>
                <Input
                  type='text'
                  placeholder='役割を追加 (例: PM, QA)'
                  value={form.newRole}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE', payload: { newRole: e.target.value } })
                  }
                  className='w-32 text-[14px]'
                />
                <Button
                  type='button'
                  size='sm'
                  variant='secondary'
                  disabled={!form.newRole.trim() || form.customRoles.includes(form.newRole.trim())}
                  onClick={() => {
                    if (form.newRole.trim() && !form.customRoles.includes(form.newRole.trim())) {
                      dispatch({
                        type: 'UPDATE',
                        payload: {
                          customRoles: [...form.customRoles, form.newRole.trim()],
                          newRole: '',
                        },
                      })
                      setShowAddRoleInput(false)
                    }
                  }}
                >
                  追加
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* 募集掲載期日 */}
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-sm'>募集掲載期日</label>
          <Input
            type='date'
            value={form.deadline}
            onChange={(e) => dispatch({ type: 'UPDATE', payload: { deadline: e.target.value } })}
            className='w-full'
          />
        </div>
        {/* 目的 */}
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-sm'>目的</label>
          <Input
            type='text'
            placeholder='目的 例: 新しいものを作りたい的な？'
            value={form.purpose}
            onChange={(e) => dispatch({ type: 'UPDATE', payload: { purpose: e.target.value } })}
            className='w-full'
          />
        </div>
        {/* メッセージ */}
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-sm'>メッセージ</label>
          <Textarea
            placeholder='ex: バックエンドとフロントエンドの人を募集しています'
            value={form.message}
            onChange={(e) => dispatch({ type: 'UPDATE', payload: { message: e.target.value } })}
            className='min-h-[120px] w-full'
          />
        </div>
        {/* 募集開始ボタン */}
        <Button
          type='submit'
          className='w-full font-bold mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          size='default'
          variant='default'
          disabled={loading}
        >
          {loading ? '送信中...' : '募集開始！'}
        </Button>
      </form>
    </Popup>
  )
}
