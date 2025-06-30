import { NextRequest, NextResponse } from 'next/server'
import yaml from 'js-yaml'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // GitHubからユーザー情報を取得
    const githubResponse = await fetch(`https://api.github.com/users/${username}`)
    if (!githubResponse.ok) {
      return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 })
    }
    
    const userData = await githubResponse.json()
    
    // リポジトリ情報を取得
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
    const reposData = await reposResponse.ok ? await reposResponse.json() : []
    
    // YAMLデータを生成
    const yamlData = {
      user: {
        username: userData.login,
        name: userData.name || userData.login,
        bio: userData.bio || '',
        avatar_url: userData.avatar_url,
        location: userData.location || '',
        company: userData.company || '',
        blog: userData.blog || '',
        twitter_username: userData.twitter_username || '',
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      },
      repositories: reposData.map((repo: any) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || '',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        html_url: repo.html_url
      })),
      analysis: {
        primary_languages: getPrimaryLanguages(reposData),
        total_stars: reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
        total_forks: reposData.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        account_age_days: Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        activity_score: calculateActivityScore(reposData)
      }
    }
    
    // YAMLに変換
    const yamlString = yaml.dump(yamlData, { 
      indent: 2,
      lineWidth: 120,
      noRefs: true 
    })
    
    // 文字コードをUTF-8で指定
    const yamlBuffer = Buffer.from(yamlString, 'utf-8')
    
    // GCSへのアップロード（実際のGCS設定が必要）
    // const gcsUrl = await uploadToGCS(yamlBuffer, `${username}-profile.yaml`)
    
    return NextResponse.json({
      success: true,
      data: yamlData,
      yaml: yamlString,
      // gcs_url: gcsUrl
    })
    
  } catch (error) {
    console.error('Error processing user profile:', error)
    return NextResponse.json(
      { error: 'Failed to process user profile' }, 
      { status: 500 }
    )
  }
}

function getPrimaryLanguages(repos: any[]): string[] {
  const languageCount: { [key: string]: number } = {}
  
  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1
    }
  })
  
  return Object.entries(languageCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([language]) => language)
}

function calculateActivityScore(repos: any[]): number {
  if (repos.length === 0) return 0
  
  const now = new Date()
  const recentActivity = repos.filter(repo => {
    const updatedAt = new Date(repo.updated_at)
    const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 30 // 30日以内の更新
  }).length
  
  return Math.round((recentActivity / repos.length) * 100)
}

// GCSアップロード関数（実際の実装が必要）
// async function uploadToGCS(buffer: Buffer, filename: string): Promise<string> {
//   // Google Cloud Storage SDKを使用した実装
//   return `https://storage.googleapis.com/bucket-name/${filename}`
// } 