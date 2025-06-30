'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProfile } from '@/hooks/useProfile'
import { useTags } from '@/hooks/useTags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, MapPin, Tag, User, Save, Loader2 } from 'lucide-react'
import ComingSoonPopup from '@/components/ui/ComingSoonPopup'
import { contestsApi, Contest } from '@/lib/api/contests'
import UserContestsList from '@/app/(home)/home/components/UserContestsList'

// 定数
const MAX_BIO_LENGTH = 1000
const MIN_AGE = 1
const MAX_AGE = 120
const MAX_LOCATION_LENGTH = 100
const MAX_NAME_LENGTH = 50
const MAX_SNS_LENGTH = 50

// SNSプラットフォームの型定義
type SnsPlatform = 'x' | 'zenn' | 'github' | 'linkedin'

// SNS情報の型定義
interface SnsInfo {
  x: string
  zenn: string
  github: string
  linkedin: string
}

// 型定義
interface FormData {
  name: string
  email: string
  emailPublic: boolean
  sns: SnsInfo
  bio: string
  age: number | null
  location: string
  tag_id: number | null
}

interface SubmitData {
  name?: string
  email?: string
  emailPublic?: boolean
  sns?: Partial<SnsInfo>
  bio?: string
  age?: number
  location?: string
  tag_id?: number
}

// ユーティリティ関数
const sanitizeHtml = (str: string): string => {
  if (typeof window === 'undefined') {
    // SSR環境ではDOMPurifyを使用できないため、基本的なサニタイズ
    return str.replace(/[<>]/g, '')
  }
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

const getInitials = (name: string): string => {
  const sanitizedName = sanitizeHtml(name)
  return sanitizedName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const createDefaultBio = (userName: string): string => {
  return `こんにちは！${userName}です。ハッカソンに参加して新しい技術やアイデアを学びたいと思っています。`
}

// バリデーション関数
const validateFormData = (data: FormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // 名前のバリデーション
  if (!data.name.trim()) {
    errors.push('名前を入力してください')
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.push(`名前は${MAX_NAME_LENGTH}文字以内で入力してください`)
  } else {
    // 特殊文字のチェック（基本的なXSS対策）
    const dangerousPattern = /[<>\"'&]/
    if (dangerousPattern.test(data.name)) {
      errors.push('名前に使用できない文字が含まれています')
    }
  }

  // メールアドレスのバリデーション
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('有効なメールアドレスを入力してください')
  }

  // SNSのバリデーション
  const snsPlatforms: Array<{ key: SnsPlatform; label: string }> = [
    { key: 'x', label: 'X (Twitter)' },
    { key: 'zenn', label: 'Zenn' },
    { key: 'github', label: 'GitHub' },
    { key: 'linkedin', label: 'LinkedIn' },
  ]

  snsPlatforms.forEach(({ key, label }) => {
    const value = data.sns[key]
    if (value && value.length > MAX_SNS_LENGTH) {
      errors.push(`${label}のユーザー名は${MAX_SNS_LENGTH}文字以内で入力してください`)
    }
  })

  // 年齢のバリデーション
  if (data.age !== null && (data.age < MIN_AGE || data.age > MAX_AGE)) {
    errors.push(`年齢は${MIN_AGE}歳から${MAX_AGE}歳の間で入力してください`)
  }

  // 自己紹介のバリデーション
  if (data.bio.length > MAX_BIO_LENGTH) {
    errors.push(`自己紹介は${MAX_BIO_LENGTH}文字以内で入力してください`)
  }

  // 場所のバリデーション
  if (data.location.length > MAX_LOCATION_LENGTH) {
    errors.push(`場所は${MAX_LOCATION_LENGTH}文字以内で入力してください`)
  }

  return { isValid: errors.length === 0, errors }
}

// ローディングコンポーネント
const LoadingSpinner = () => (
  <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20'>
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin' />
        <span className='ml-2'>読み込み中...</span>
      </div>
    </div>
  </div>
)

// 認証エラーコンポーネント
const AuthError = () => (
  <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20'>
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>ログインが必要です</h1>
        <p className='text-gray-600'>プロフィールを編集するにはログインしてください。</p>
      </div>
    </div>
  </div>
)

// フォームフィールドコンポーネント
const NameField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>名前</label>
    <Input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='名前を入力してください'
      maxLength={MAX_NAME_LENGTH}
      className='w-full'
    />
  </div>
)

// メールアドレス専用フィールド
const EmailField = ({
  email,
  emailPublic,
  onEmailPublicChange,
}: {
  email: string
  emailPublic: boolean
  onEmailPublicChange: () => void
}) => (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>メールアドレス</label>
    <Input type='text' value={email} placeholder='example@gmail.com' className='w-full' disabled />
    <div className='flex items-center space-x-2'>
      <input
        type='checkbox'
        id='emailPublic'
        checked={emailPublic}
        onChange={onEmailPublicChange}
        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
      />
      <label htmlFor='emailPublic' className='text-sm text-gray-700'>
        メールアドレスをプロフィールに公開する
      </label>
    </div>
    <p className='text-xs text-gray-500 mt-1'>ログイン時のメールアドレスです</p>
  </div>
)

const ContactInfoField = ({
  sns,
  onSnsChange,
  hideSns,
  onSnsDisabledFocus,
}: {
  sns: SnsInfo
  onSnsChange: (field: keyof typeof sns, value: string) => void
  hideSns?: boolean
  onSnsDisabledFocus?: () => void
}) => (
  <div className='space-y-4'>
    {!hideSns && (
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>SNS情報（任意）</label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>X (Twitter)</label>
            <Input
              type='text'
              value={sns.x}
              onChange={(e) => onSnsChange('x', e.target.value)}
              placeholder='@username'
              className='w-full'
              disabled
              onFocus={onSnsDisabledFocus}
              onClick={onSnsDisabledFocus}
            />
          </div>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>Zenn</label>
            <Input
              type='text'
              value={sns.zenn}
              onChange={(e) => onSnsChange('zenn', e.target.value)}
              placeholder='username'
              className='w-full'
              disabled
              onFocus={onSnsDisabledFocus}
              onClick={onSnsDisabledFocus}
            />
          </div>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>GitHub</label>
            <Input
              type='text'
              value={sns.github}
              onChange={(e) => onSnsChange('github', e.target.value)}
              placeholder='username'
              className='w-full'
              disabled
              onFocus={onSnsDisabledFocus}
              onClick={onSnsDisabledFocus}
            />
          </div>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>LinkedIn</label>
            <Input
              type='text'
              value={sns.linkedin}
              onChange={(e) => onSnsChange('linkedin', e.target.value)}
              placeholder='username'
              className='w-full'
              disabled
              onFocus={onSnsDisabledFocus}
              onClick={onSnsDisabledFocus}
            />
          </div>
        </div>
      </div>
    )}
  </div>
)

const BioField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>自己紹介</label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='あなたの自己紹介を入力してください（最大1000文字）'
      maxLength={MAX_BIO_LENGTH}
      rows={4}
      className='w-full'
    />
    <p className='text-xs text-gray-500 mt-1'>
      {value.length}/{MAX_BIO_LENGTH}文字
    </p>
  </div>
)

const AgeField = ({
  value,
  onChange,
}: {
  value: number | null
  onChange: (value: number | null) => void
}) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>年齢</label>
    <Input
      type='number'
      value={value === null ? '' : value.toString()}
      onChange={(e) => {
        const numValue = e.target.value ? parseInt(e.target.value, 10) : null
        // 型ガード: NaNの場合はnullを設定
        onChange(isNaN(numValue as number) ? null : numValue)
      }}
      placeholder='25'
      min={MIN_AGE.toString()}
      max={MAX_AGE.toString()}
    />
  </div>
)

const LocationField = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>場所</label>
    <Input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='東京'
      maxLength={MAX_LOCATION_LENGTH}
    />
  </div>
)

const TagField = ({
  value,
  onChange,
  tags,
}: {
  value: number | null
  onChange: (value: number | null) => void
  tags: Array<{ id: number; name: string }>
}) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>タグ（専門分野）</label>
    <select
      value={value === null ? '' : value.toString()}
      onChange={(e) => {
        const numValue = e.target.value ? parseInt(e.target.value, 10) : null
        // 型ガード: NaNの場合はnullを設定
        onChange(isNaN(numValue as number) ? null : numValue)
      }}
      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      <option value=''>選択してください</option>
      {tags.map((tag) => (
        <option key={tag.id} value={tag.id.toString()}>
          {tag.name}
        </option>
      ))}
    </select>
  </div>
)

// SNS専用フィールド
const SnsField = ({ sns, onDisabledFocus }: { sns: SnsInfo; onDisabledFocus: () => void }) => (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>SNS情報（任意）</label>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      <div>
        <label className='block text-sm text-gray-600 mb-1'>X (Twitter)</label>
        <Input
          type='text'
          value={sns.x}
          placeholder='@username'
          className='w-full bg-gray-100 text-gray-400 cursor-not-allowed'
          readOnly
          tabIndex={0}
          onFocus={onDisabledFocus}
          onClick={onDisabledFocus}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600 mb-1'>Zenn</label>
        <Input
          type='text'
          value={sns.zenn}
          placeholder='username'
          className='w-full bg-gray-100 text-gray-400 cursor-not-allowed'
          readOnly
          tabIndex={0}
          onFocus={onDisabledFocus}
          onClick={onDisabledFocus}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600 mb-1'>GitHub</label>
        <Input
          type='text'
          value={sns.github}
          placeholder='username'
          className='w-full bg-gray-100 text-gray-400 cursor-not-allowed'
          readOnly
          tabIndex={0}
          onFocus={onDisabledFocus}
          onClick={onDisabledFocus}
        />
      </div>
      <div>
        <label className='block text-sm text-gray-600 mb-1'>LinkedIn</label>
        <Input
          type='text'
          value={sns.linkedin}
          placeholder='username'
          className='w-full bg-gray-100 text-gray-400 cursor-not-allowed'
          readOnly
          tabIndex={0}
          onFocus={onDisabledFocus}
          onClick={onDisabledFocus}
        />
      </div>
    </div>
  </div>
)

// プレビューコンポーネント
const ProfilePreview = ({
  currentUser,
  formData,
  tags,
}: {
  currentUser: { name: string; icon_url?: string; gmail: string }
  formData: FormData
  tags: Array<{ id: number; name: string }>
}) => {
  const selectedTag = useMemo(
    () => tags.find((tag) => tag.id.toString() === formData.tag_id?.toString()),
    [tags, formData.tag_id]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>プレビュー</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-center mb-4'>
          <Avatar className='w-20 h-20 mx-auto mb-4'>
            <AvatarImage src={currentUser.icon_url} />
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg'>
              {getInitials(formData.name || currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <h3 className='text-lg font-semibold text-gray-900'>
            {formData.name || currentUser.name}
          </h3>
          {formData.emailPublic && <p className='text-sm text-gray-500'>{formData.email}</p>}
        </div>

        {/* SNS情報 */}
        {(formData.sns.x || formData.sns.zenn || formData.sns.github || formData.sns.linkedin) && (
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>SNS</h4>
            <div className='flex flex-wrap gap-2'>
              {formData.sns.x && (
                <span className='px-2 py-1 bg-black text-white rounded-full text-xs'>
                  X: {formData.sns.x}
                </span>
              )}
              {formData.sns.zenn && (
                <span className='px-2 py-1 bg-blue-500 text-white rounded-full text-xs'>
                  Zenn: {formData.sns.zenn}
                </span>
              )}
              {formData.sns.github && (
                <span className='px-2 py-1 bg-gray-800 text-white rounded-full text-xs'>
                  GitHub: {formData.sns.github}
                </span>
              )}
              {formData.sns.linkedin && (
                <span className='px-2 py-1 bg-blue-600 text-white rounded-full text-xs'>
                  LinkedIn: {formData.sns.linkedin}
                </span>
              )}
            </div>
          </div>
        )}

        {formData.bio && (
          <div className='mb-4'>
            <p className='text-sm text-gray-700'>{formData.bio}</p>
          </div>
        )}

        <div className='space-y-2 text-sm text-gray-600'>
          {formData.age && (
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <span>{formData.age}歳</span>
            </div>
          )}
          {formData.location && (
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4' />
              <span>{formData.location}</span>
            </div>
          )}
          {selectedTag && (
            <div className='flex items-center gap-2'>
              <Tag className='w-4 h-4' />
              <span className='px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs'>
                {selectedTag.name}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const {
    profile,
    loading: profileLoading,
    createProfile,
    updateProfile,
  } = useProfile({
    userId: currentUser?.id,
    autoFetch: true,
  })
  const { tags } = useTags()
  const [myContests, setMyContests] = useState<Contest[]>([])

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    emailPublic: true,
    sns: {
      x: '',
      zenn: '',
      github: '',
      linkedin: '',
    },
    bio: '',
    age: null,
    location: '',
    tag_id: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [showEmailComingSoon, setShowEmailComingSoon] = useState(false)
  const [showSnsComingSoon, setShowSnsComingSoon] = useState(false)

  // プロフィールデータをフォームに設定
  useEffect(() => {
    if (profile) {
      // 既存のプロフィールデータがある場合
      setFormData({
        name: currentUser?.name || '',
        email: '',
        emailPublic: false, // デフォルトは非公開
        sns: {
          x: '',
          zenn: '',
          github: '',
          linkedin: '',
        },
        bio: profile.bio || '',
        age: profile.age || null,
        location: profile.location || '',
        tag_id: profile.tag_id || null,
      })
    } else if (currentUser && !profileLoading) {
      // プロフィールデータがない場合、デフォルト値を設定
      setFormData({
        name: currentUser.name,
        email: '',
        emailPublic: true,
        sns: {
          x: '',
          zenn: '',
          github: '',
          linkedin: '',
        },
        bio: createDefaultBio(currentUser.name),
        age: null,
        location: '',
        tag_id: null,
      })
    }
  }, [profile, currentUser, profileLoading])

  useEffect(() => {
    if (!currentUser?.id) return
    contestsApi.list({ author_id: currentUser.id }).then((res) => {
      setMyContests(res.contests || [])
    })
  }, [currentUser?.id])

  // フォームデータの更新ハンドラー
  const handleFormChange = useCallback((field: keyof FormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // エラーをクリア
    setErrors([])
  }, [])

  // SNSフィールドの更新ハンドラー
  const handleSnsChange = useCallback((field: keyof FormData['sns'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      sns: { ...prev.sns, [field]: value },
    }))
    // エラーをクリア
    setErrors([])
  }, [])

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!currentUser?.id) {
        setErrors(['ユーザー情報が見つかりません'])
        return
      }

      // バリデーション
      const validation = validateFormData(formData)
      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }

      setIsSubmitting(true)
      setErrors([])

      try {
        // 送信データの準備（undefinedの値を除外）
        const submitData: SubmitData = Object.fromEntries(
          Object.entries({
            name: formData.name,
            email: formData.email,
            emailPublic: formData.emailPublic,
            sns: formData.sns,
            bio: formData.bio,
            age: formData.age,
            location: formData.location,
            tag_id: formData.tag_id,
          }).filter(([, value]) => value !== '' && value !== null && value !== undefined)
        ) as SubmitData

        if (profile) {
          // 既存プロフィールを更新
          await updateProfile(profile.id, submitData)
          alert('プロフィールを更新しました')
        } else {
          // 新規プロフィールを作成
          await createProfile({
            user_id: currentUser.id,
            ...submitData,
          })
          alert('プロフィールを作成しました')
        }
      } catch (error) {
        // 機密情報をログに出力しない
        console.error(
          'プロフィール保存エラー:',
          error instanceof Error ? error.message : 'Unknown error'
        )
        setErrors(['プロフィールの保存に失敗しました'])
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentUser?.id, formData, profile, createProfile, updateProfile]
  )

  // ローディング状態
  if (userLoading || profileLoading) {
    return <LoadingSpinner />
  }

  // 認証エラー
  if (!currentUser) {
    return <AuthError />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>プロフィール編集</h1>
          <p className='text-gray-600'>あなたのプロフィール情報を更新してください</p>
        </div>

        {/* エラーメッセージ */}
        {errors.length > 0 && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md'>
            <ul className='text-red-700 text-sm space-y-1'>
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 左側: プロフィール情報 */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='w-5 h-5' />
                  プロフィール情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <NameField
                    value={formData.name}
                    onChange={(value) => handleFormChange('name', value)}
                  />
                  <EmailField
                    email={formData.email}
                    emailPublic={formData.emailPublic}
                    onEmailPublicChange={() => setShowEmailComingSoon(true)}
                  />
                  <ContactInfoField
                    sns={formData.sns}
                    onSnsChange={(field, value) =>
                      handleSnsChange(field as keyof typeof formData.sns, value)
                    }
                    hideSns
                    onSnsDisabledFocus={undefined}
                  />
                  <BioField
                    value={formData.bio}
                    onChange={(value) => handleFormChange('bio', value)}
                  />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <AgeField
                      value={formData.age}
                      onChange={(value) => handleFormChange('age', value)}
                    />
                    <LocationField
                      value={formData.location}
                      onChange={(value) => handleFormChange('location', value)}
                    />
                  </div>
                  <TagField
                    value={formData.tag_id}
                    onChange={(value) => handleFormChange('tag_id', value)}
                    tags={tags}
                  />
                  <SnsField sns={formData.sns} onDisabledFocus={() => setShowSnsComingSoon(true)} />
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4 mr-2' />
                        保存
                      </>
                    )}
                  </Button>
                  <ComingSoonPopup
                    open={showEmailComingSoon}
                    onOpenChange={setShowEmailComingSoon}
                    featureName='メールアドレス公開'
                    description='メールアドレスの公開機能は現在準備中です。Google Cloud Next Tokyo 2025でリリース予定です。'
                  />
                  <ComingSoonPopup
                    open={showSnsComingSoon}
                    onOpenChange={setShowSnsComingSoon}
                    featureName='SNS連携'
                    description='SNS連携機能は現在準備中です。Google Cloud Next Tokyo 2025でリリース予定です。'
                  />
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 右側: プレビュー */}
          <div>
            <ProfilePreview currentUser={currentUser} formData={formData} tags={tags} />
          </div>
        </div>

        {myContests.length > 0 && (
          <div className='mt-10'>
            <UserContestsList contests={myContests} />
          </div>
        )}
      </div>
    </div>
  )
}
