'use client'

import { apiClient } from '@/lib/api-client'
import { geminiAPI } from '@/lib/gemini-api'
import { usersApi } from '@/lib/api/users'

// マッチング結果の型定義
export interface MatchingResult {
  user_id: number
  name: string
  gmail: string
  icon_url?: string
  profile?: {
    id: number
    bio?: string
    age?: number
    location?: string
    tag?: {
      id: number
      name: string
    }
  }
  similarity_score: number
  matching_reasons: string[]
  compatibility_analysis: string
}

// マッチングリクエストの型定義
export interface MatchingRequest {
  user_id: number
  preferences?: {
    min_age?: number
    max_age?: number
    location?: string
    tag_id?: number
    skills?: string[]
    interests?: string[]
  }
  limit?: number
}

// マッチングレスポンスの型定義
export interface MatchingResponse {
  matches: MatchingResult[]
  total_count: number
  analysis_summary: string
}

// Profile型を定義
interface Profile {
  user_id: number
  bio?: string
  age?: number
  location?: string
  tag_id?: number
  tag?: { id: number; name: string }
  user?: {
    id: number
    name: string
    gmail: string
    icon_url?: string
  }
}

// AIの生データ用型
type MatchingResultRaw = {
  user_id: number
  similarity_score: number
  matching_reasons: string[]
  compatibility_analysis: string
}

// usersApi.list用のUser型
interface User {
  id: number
  name: string
  gmail: string
  icon_url?: string
}

// AIマッチング機能
export const matchingApi = {
  // AIを活用したマッチング実行
  async findMatches(request: MatchingRequest): Promise<MatchingResponse> {
    try {
      // 1. 現在のユーザーのプロフィールを取得
      const currentUserProfile = await this.getUserProfile(request.user_id)
      if (!currentUserProfile) {
        throw new Error('ユーザープロフィールが見つかりません')
      }

      // 2. 全ユーザーのプロフィールを取得
      const allProfiles = await this.getAllUserProfiles()

      // 3. 自分以外のユーザーをフィルタリング
      const otherUsers = allProfiles.filter((profile) => profile.user_id !== request.user_id)

      // 4. 基本フィルタリング（年齢、場所、タグ）
      const filteredUsers = this.applyBasicFilters(otherUsers, request.preferences)

      // 5. AIによる詳細マッチング分析
      const matches = await this.performAIMatching(
        currentUserProfile,
        filteredUsers,
        request.limit || 10
      )

      // 6. 結果を整形
      const analysisSummary = await this.generateAnalysisSummary(currentUserProfile, matches)

      return {
        matches,
        total_count: matches.length,
        analysis_summary: analysisSummary,
      }
    } catch (error) {
      console.error('Matching failed:', error)
      throw error
    }
  },

  // ユーザープロフィール取得
  async getUserProfile(userId: number): Promise<Profile | null> {
    try {
      const response = await apiClient.get(`/api/v1/profiles/user/${userId}`, false, true)
      return response as Profile
    } catch (error) {
      console.error('Failed to get user profile:', error)
      return null
    }
  },

  // 全ユーザープロフィール取得
  async getAllUserProfiles(): Promise<Profile[]> {
    try {
      const response = (await apiClient.get('/api/v1/profiles', false)) as { profiles: Profile[] }
      const profiles = response.profiles || []
      // 追加: 全ユーザー情報を取得し、user_idでマージ
      const usersList = await usersApi.list({ limit: 1000 })
      const users = usersList.users as User[]
      const usersMap = new Map<number, Profile['user']>(
        users.map((u) => [u.id, { id: u.id, name: u.name, gmail: u.gmail, icon_url: u.icon_url }])
      )
      return profiles.map((profile) => ({
        ...profile,
        user: usersMap.get(profile.user_id),
      }))
    } catch {
      return []
    }
  },

  // 基本フィルタリング
  applyBasicFilters(users: Profile[], preferences?: Record<string, unknown>) {
    if (!preferences) return users

    return users.filter((user) => {
      // 年齢フィルタ
      if (
        typeof preferences.min_age === 'number' &&
        typeof user.age === 'number' &&
        user.age < preferences.min_age
      )
        return false
      if (
        typeof preferences.max_age === 'number' &&
        typeof user.age === 'number' &&
        user.age > preferences.max_age
      )
        return false

      // 場所フィルタ
      if (preferences.location && user.location && user.location !== preferences.location)
        return false

      // タグフィルタ
      if (preferences.tag_id && user.tag_id && user.tag_id !== preferences.tag_id) return false

      return true
    })
  },

  // AIによる詳細マッチング分析
  async performAIMatching(
    currentProfile: Profile,
    candidates: Profile[],
    limit: number
  ): Promise<MatchingResult[]> {
    const prompt = `以下のユーザープロフィールを基に、最も相性の良いユーザーを${limit}人選んでください。

**基準ユーザー（自分）:**
- 名前: ${currentProfile.user && 'name' in currentProfile.user ? currentProfile.user.name : '不明'}
- 自己紹介: ${currentProfile.bio || '未設定'}
- 年齢: ${currentProfile.age ?? '不明'}
- 場所: ${currentProfile.location || '不明'}
- タグ: ${currentProfile.tag && 'name' in currentProfile.tag ? currentProfile.tag.name : '不明'}

**候補ユーザー:**
${candidates
  .map(
    (user, index) => `
${index + 1}. ${user.user && 'name' in user.user ? user.user.name : '不明'}
   - 自己紹介: ${user.bio || '未設定'}
   - 年齢: ${user.age ?? '不明'}
   - 場所: ${user.location || '不明'}
   - タグ: ${user.tag && 'name' in user.tag ? user.tag.name : '不明'}
`
  )
  .join('\n')}

以下の観点で分析してください：
1. 技術的な相性（スキル、興味分野）
2. コミュニケーションスタイル
3. ハッカソンでの役割の補完性
4. 年齢・場所の適性
5. 全体的な相性

各候補に対して以下を出力してください：
- 類似度スコア（0-100）
- マッチング理由（3つまで）
- 相性分析（100文字程度）

結果は以下のJSON形式で出力してください：
{
  "matches": [
    {
      "user_id": [ユーザーID],
      "similarity_score": [スコア],
      "matching_reasons": ["理由1", "理由2", "理由3"],
      "compatibility_analysis": "相性分析"
    }
  ]
}`

    try {
      const response = await geminiAPI.generateResponse(prompt, [])

      if (response.error) {
        throw new Error('AI分析に失敗しました')
      }

      // JSONレスポンスをパース
      let aiResult
      try {
        aiResult = JSON.parse(response.text)
      } catch {
        // JSONでなければフォールバック
        return this.fallbackMatching(currentProfile, candidates, limit)
      }

      // 結果を整形
      const matches: MatchingResult[] = (aiResult.matches as MatchingResultRaw[]).map((match) => {
        const candidate = candidates.find((c) => c.user_id === match.user_id)
        return {
          user_id: match.user_id,
          name:
            candidate && candidate.user && 'name' in candidate.user ? candidate.user.name : '不明',
          gmail:
            candidate && candidate.user && 'gmail' in candidate.user ? candidate.user.gmail : '',
          icon_url:
            candidate && candidate.user && 'icon_url' in candidate.user
              ? candidate.user.icon_url
              : undefined,
          profile: candidate
            ? {
                id: candidate.user_id,
                bio: candidate.bio,
                age: candidate.age,
                location: candidate.location,
                tag: candidate.tag,
              }
            : undefined,
          similarity_score: match.similarity_score,
          matching_reasons: match.matching_reasons,
          compatibility_analysis: match.compatibility_analysis,
        }
      })

      return matches.sort((a, b) => b.similarity_score - a.similarity_score)
    } catch {
      // AI分析に失敗した場合は基本的な類似度計算で代替
      return this.fallbackMatching(currentProfile, candidates, limit)
    }
  },

  // フォールバックマッチング（AI分析失敗時）
  fallbackMatching(
    currentProfile: Profile,
    candidates: Profile[],
    limit: number
  ): MatchingResult[] {
    const matches = candidates.map((candidate: Profile) => {
      let score = 50 // ベーススコア
      // タグの一致
      if (currentProfile.tag_id && candidate.tag_id && currentProfile.tag_id === candidate.tag_id)
        score += 20
      // 場所の一致
      if (
        currentProfile.location &&
        candidate.location &&
        currentProfile.location === candidate.location
      )
        score += 15
      // 年齢の近さ
      if (typeof currentProfile.age === 'number' && typeof candidate.age === 'number') {
        const ageDiff = Math.abs(currentProfile.age - candidate.age)
        if (ageDiff <= 2) score += 15
        else if (ageDiff <= 5) score += 10
        else if (ageDiff <= 10) score += 5
      }
      // 自己紹介の類似性（簡単なキーワードマッチング）
      const currentBio =
        typeof currentProfile.bio === 'string' ? currentProfile.bio.toLowerCase() : ''
      const candidateBio = typeof candidate.bio === 'string' ? candidate.bio.toLowerCase() : ''
      const commonKeywords = [
        'react',
        'typescript',
        'python',
        'ai',
        '機械学習',
        'フロントエンド',
        'バックエンド',
        'デザイン',
      ]
      commonKeywords.forEach((keyword) => {
        if (currentBio.includes(keyword) && candidateBio.includes(keyword)) {
          score += 5
        }
      })
      return {
        user_id: candidate.user_id,
        name: candidate.user && 'name' in candidate.user ? candidate.user.name : '不明',
        gmail: candidate.user && 'gmail' in candidate.user ? candidate.user.gmail : '',
        icon_url:
          candidate.user && 'icon_url' in candidate.user ? candidate.user.icon_url : undefined,
        profile: {
          id: candidate.user_id,
          bio: candidate.bio,
          age: candidate.age,
          location: candidate.location,
          tag: candidate.tag,
        },
        similarity_score: Math.min(score, 100),
        matching_reasons: ['技術的な相性', '場所の近さ', '年齢の近さ'],
        compatibility_analysis: '基本的な類似度計算によるマッチング結果です。',
      }
    })

    return matches.sort((a, b) => b.similarity_score - a.similarity_score).slice(0, limit)
  },

  // 分析サマリー生成
  async generateAnalysisSummary(
    currentProfile: Profile,
    matches: MatchingResult[]
  ): Promise<string> {
    const prompt = `以下のマッチング結果を基に、簡潔な分析サマリーを作成してください。

**基準ユーザー:**
- 名前: ${currentProfile.user && 'name' in currentProfile.user ? currentProfile.user.name : '不明'}
- 自己紹介: ${currentProfile.bio || '未設定'}

**マッチング結果:**
${matches
  .map(
    (match, index) => `
${index + 1}. ${match.name} (類似度: ${match.similarity_score}%)
   - 理由: ${match.matching_reasons.join(', ')}
   - 分析: ${match.compatibility_analysis}
`
  )
  .join('\n')}

100文字程度で、マッチング結果の特徴と推奨事項をまとめてください。`

    try {
      const response = await geminiAPI.generateResponse(prompt, [])
      return response.error ? 'マッチング分析が完了しました。' : response.text
    } catch {
      return 'マッチング分析が完了しました。'
    }
  },
}
