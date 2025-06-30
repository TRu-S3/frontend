import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const AI_AGENT_BASE_URL = 'https://ai-agent-696136807010.asia-northeast1.run.app'
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    console.log("body", body)
    const response = await fetch(`${AI_AGENT_BASE_URL}/api/workflows/repositoryAnalysisWorkflow/start-async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `AI Agentの呼び出しに失敗: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json();
    const yaml = data.result?.yaml
    console.log("yaml", yaml)

    // YAMLをプロファイルJSONに変換
    const profileJson = await yamlToProfile(yaml)
    return NextResponse.json(profileJson)


  } catch (error) {
    console.error('エラー:', error)
    return NextResponse.json(
      { error: 'AI Agentとの通信に失敗しました' },
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

  console.log("cleaned_result", cleaned_result)
  try {
    const extractedJson = JSON.parse(cleaned_result)
    return extractedJson
  } catch (e) {
    console.error('JSONパース失敗:', e)
    throw new Error('Geminiの出力をJSONとして解釈できませんでした')
  }
}