import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
import yaml from 'js-yaml'

const AI_AGENT_BASE_URL = 'https://ai-agent-696136807010.asia-northeast1.run.app'
const PROJECT_ID = process.env.PROJECT_ID
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS
const BUCKET_NAME = process.env.BUCKET_NAME

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    // AI Agentが期待するパラメータ名に変換
    const aiAgentBody = {
      inputData: {
        gitHubAccountName: body.username
      }
    }
    
    const response = await fetch(`${AI_AGENT_BASE_URL}/api/workflows/repositoryAnalysisWorkflow/start-async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiAgentBody),
    })

    console.log('AI Agent response status:', response.status)
    console.log('AI Agent response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI Agent error response:', errorText)
      return NextResponse.json(
        { error: `AI Agentの呼び出しに失敗: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json();
    console.log('AI Agent response data:', data)
    console.log('AI Agent response data keys:', Object.keys(data))
    console.log('AI Agent response data.result:', data.result)
    console.log('AI Agent response data.result keys:', data.result ? Object.keys(data.result) : 'No result')
    
    const yaml = data.result?.yaml || data.yaml || data.result?.data?.yaml
    console.log('YAML data found:', !!yaml)
    if (yaml) {
      console.log('YAML data length:', yaml.length)
      console.log('YAML data preview:', yaml.substring(0, 200))
    }
    
    if (!yaml) {
      console.error('No YAML data in response:', data)
      // AI Agentからのレスポンス構造を詳しく調査
      console.log('Full AI Agent response for debugging:', JSON.stringify(data, null, 2))
      
      // 一時的にダミーデータを返してテスト
      const dummyData = {
        name: 'テストユーザー',
        bio: 'テスト用のプロフィールです',
        skills: {
          hackathonCount: 5,
          strongRoles: ['フロントエンド', 'バックエンド'],
          challengeRoles: ['DevOps']
        },
        projects: {
          blog: 'https://example.com',
          github: 'https://github.com/testuser'
        },
        github: {
          repositories: 10,
          contributions: 500,
          languages: ['JavaScript', 'TypeScript'],
          frameworks: ['React', 'Next.js'],
          achievements: ['ハッカソン優勝'],
          recentProjects: ['プロジェクトA', 'プロジェクトB']
        }
      }
      return NextResponse.json(dummyData)
    }

    // GCSにyamlをTXT形式でアップロード
    const uploadResult = await gcsFileUpload(yaml)
    console.log('GCS upload result:', uploadResult)

    // YAMLをプロファイルJSONに変換
    const profileJson = await yamlToProfile(yaml)
    console.log('Profile JSON result:', profileJson)
    
    return NextResponse.json(profileJson)

  } catch (error) {
    console.error('APIエラー詳細:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `AI Agentとの通信に失敗しました: ${errorMessage}` },
      { status: 500 }
    )
  }
}

async function yamlToProfile(yaml: string) {
  const model = google("gemini-2.0-flash-001");
  const prompt = `
以下のGitHubユーザーの分析結果（YAML）を、次のようなJSON形式に変換してください：

{
  name: '...',
  bio: [与えられた情報をもとに簡単にユーザーの紹介文を書く],
  skills: {
    hackathonCount: ...,
    strongRoles: [...],
    challengeRoles: [...]
  },
  projects: {
    blog: '...',
    github: https://github.com/[ここにgithub_usernameの値を入れる]
  },
  github: {
    repositories: ...,
    contributions: ...,
    languages: [...],
    frameworks: [...],
    achievements: [...],
    recentProjects: [ここもプロジェクトの内容を説明する]
  }
}

変換対象（YAML）:
${yaml}

- JSONとしてのみ出力してください。余計な説明やコメントは不要です。
- **すべての値を必ず埋めてください**。
- **結果は日本語で記述してください**。
`

  const result = await generateText({ model, prompt })
  const cleaned_result = result.text.replace(/```(?:json)?\s*|\s*```/g, "").trim();

  try {
    const extractedJson = JSON.parse(cleaned_result)
    return extractedJson
  } catch (e) {
    console.error('JSONパース失敗:', e)
    throw new Error('Geminiの出力をJSONとして解釈できませんでした')
  }
}

async function gcsFileUpload(yaml: string) {
  if (!BUCKET_NAME || !GOOGLE_APPLICATION_CREDENTIALS) {
     throw new Error('環境変数が取得できませんでした。')
  }
  
  const storage = new Storage({
    projectId: PROJECT_ID,
    // credentials: JSON.parse(GOOGLE_APPLICATION_CREDENTIALS), // ファイルパス指定時は不要
  })
  const bucket = storage.bucket(BUCKET_NAME)

  const { llmText, repository_summaries } = await yamlToText(yaml)

  const combinedText = `${llmText}\n${repository_summaries}`

  const uniqueId = uuidv4()
  const filePath = `rag/${Date.now()}-${uuidv4()}.txt`
  const buffer = Buffer.from(combinedText, 'utf-8')

  await bucket.file(filePath).save(buffer, {
    contentType: 'text/plain; charset=utf-8',
  })

  return {
    message: 'TXTファイルをアップロードしました',
    path: `gs://${BUCKET_NAME}/${filePath}`,
    fileId: uniqueId,
  }
}

async function yamlToText(yamlStr: string) {
  const model = google("gemini-2.0-flash-001");

  const parsed = yaml.load(yamlStr) as any
  console.log('Parsed YAML structure:', parsed)
  
  const publicSection = parsed?.public
  console.log('Public section:', publicSection)

  if (!publicSection) {
    console.warn('Public section not found in YAML, using fallback')
    return {
      llmText: 'ユーザー情報が見つかりませんでした',
      repository_summaries: 'リポジトリ情報が見つかりませんでした',
    }
  }

  const { repository_summaries, ...rest } = publicSection
  const yamlForLLM = yaml.dump({ public: rest })

  const prompt = `
以下のGitHubユーザーの分析結果（YAML）をテキストで説明してください。

変換対象（YAML）:
${yamlForLLM}

- 必ずテキスト形式で出力してください。余計な説明やコメントは不要です。
- **結果は日本語で記述してください**。
`
  const result = await generateText({ model, prompt })

  return {
    llmText: result.text,
    repository_summaries: repository_summaries || 'リポジトリ情報が見つかりませんでした',
  }
}