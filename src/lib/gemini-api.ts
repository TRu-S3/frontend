interface ChatMessage {
  role: 'user' | 'model'
  parts: string
}

interface GeminiResponse {
  text: string
  error?: string
}

class GeminiAPI {
  private apiKey: string
  private projectId: string
  private baseUrl: string
  private rateLimitDelay = 1000 // 1秒間隔
  private lastRequestTime = 0

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_AI_CHAT || ''
    this.projectId = process.env.NEXT_PUBLIC_GCP_PROJECT_ID || 'zenn-ai-agent-hackathon-460205'

    // Google Cloud APIキーを使用する場合のエンドポイント
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`

    // 開発環境でのみデバッグログを出力
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Gemini API Configuration ===')
      console.log(
        'API Key loaded:',
        this.apiKey ? 'Yes (length: ' + this.apiKey.length + ')' : 'No'
      )
      console.log(
        'API Key preview:',
        this.apiKey ? this.apiKey.substring(0, 20) + '...' : 'Not set'
      )
      console.log(
        'API Key type check:',
        this.apiKey
          ? this.apiKey.startsWith('AIza')
            ? 'Google API Key'
            : 'Other format'
          : 'Not set'
      )
      console.log('Project ID:', this.projectId)
      console.log('Base URL:', this.baseUrl)
      console.log('Environment variables:', {
        NEXT_PUBLIC_AI_CHAT: process.env.NEXT_PUBLIC_AI_CHAT ? 'Set' : 'Not set',
        AI_CHAT: process.env.AI_CHAT ? 'Set' : 'Not set',
        NEXT_PUBLIC_GCP_PROJECT_ID: process.env.NEXT_PUBLIC_GCP_PROJECT_ID ? 'Set' : 'Not set',
      })
      console.log('================================')
    }

    if (!this.apiKey) {
      console.warn('Gemini API key not found in environment variables')
    }

    // APIキーの権限をテスト
    this.testAPIKeyPermissions()
  }

  private async testAPIKeyPermissions(): Promise<void> {
    if (!this.apiKey) return

    try {
      // 利用可能なモデルを取得してAPIキーの権限をテスト
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`
      const response = await fetch(testUrl)

      // 開発環境でのみログを出力
      if (process.env.NODE_ENV === 'development') {
        console.log('=== API Key Permission Test ===')
        console.log('Test URL:', testUrl)
        console.log('Response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('Available models:', data.models?.length || 0)
          console.log('API key has access to Generative Language API')
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('API key permission test failed:', errorData)
          console.log('API key does not have access to Generative Language API')
        }
        console.log('================================')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('API key permission test error:', error)
      }
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delayTime = this.rateLimitDelay - timeSinceLastRequest
      await this.delay(delayTime)
    }

    this.lastRequestTime = Date.now()
  }

  async generateResponse(
    userMessage: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    conversationHistory: ChatMessage[] = [] // TODO: 将来の会話履歴機能のために保持
  ): Promise<GeminiResponse> {
    try {
      if (!this.apiKey) {
        return {
          text: '申し訳ございません。AIチャット機能が一時的に利用できません。',
          error: 'API key not configured',
        }
      }

      await this.checkRateLimit()

      // プロンプトの構築
      const systemPrompt = `あなたはハッカソンイベントのマッチングプラットフォーム「UltraSoulMatch.ai」のAIアシスタントです。

【UltraSoulMatch.aiの特徴】
- ハッカソンやプロジェクトに最適なチームメンバーをAIがサポートして見つけます
- スキル・志向・活動履歴など多角的なプロフィールでマッチング精度が高い
- チーム募集・参加・メッセージ・ブックマークなど多彩な機能
- 初心者から経験者まで幅広くサポート
- コミュニティやイベント情報も充実
- 安心・安全なやりとりを重視

【AIアシスタントの役割】
- ユーザーの質問に親切・丁寧・迅速に回答
- プラットフォームの使い方や機能をわかりやすく案内
- チーム作りやハッカソン参加のコツ、プロフィール充実のアドバイス
- 技術的な質問やイベント情報にも対応
- 日本語で自然な会話を行い、ユーザーの不安や疑問を解消

現在の会話履歴を考慮して、UltraSoulMatch.aiの価値が伝わるような回答を提供してください。`

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nユーザー: ${userMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      })

      // 開発環境でのみログを出力
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response status:', response.status)
        console.log('API Response headers:', Object.fromEntries(response.headers.entries()))
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Gemini API error:', errorData)
        console.error('Response status:', response.status)
        console.error('Response statusText:', response.statusText)

        if (response.status === 401) {
          return {
            text: '申し訳ございません。認証エラーが発生しました。APIキーの設定を確認してください。',
            error: 'Authentication failed',
          }
        }

        if (response.status === 403) {
          const errorMessage = errorData.error?.message || 'Permission denied'
          console.error('403 Error details:', errorMessage)
          return {
            text: `申し訳ございません。APIアクセス権限がありません。Google Cloud ConsoleでGenerative Language APIを有効にしてください。\n\nエラー詳細: ${errorMessage}`,
            error: 'Permission denied',
          }
        }

        if (response.status === 429) {
          return {
            text: '申し訳ございません。リクエストが多すぎます。少し時間をおいてから再度お試しください。',
            error: 'Rate limit exceeded',
          }
        }

        return {
          text: '申し訳ございません。AIチャット機能でエラーが発生しました。',
          error: `API error: ${response.status}`,
        }
      }

      const data = await response.json()

      // 開発環境でのみログを出力
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response data:', data)
      }

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        !data.candidates[0].content.parts[0]
      ) {
        return {
          text: '申し訳ございません。AIからの応答を取得できませんでした。',
          error: 'No response from AI',
        }
      }

      const aiResponse = data.candidates[0].content.parts[0].text

      return {
        text: aiResponse,
      }
    } catch (error) {
      console.error('Gemini API request failed:', error)
      return {
        text: '申し訳ございません。AIチャット機能でエラーが発生しました。しばらく時間をおいてから再度お試しください。',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

export const geminiAPI = new GeminiAPI()
export type { ChatMessage, GeminiResponse }
