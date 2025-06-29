import { NextRequest, NextResponse } from 'next/server'

// 画像URLの妥当性をチェックする関数
async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒タイムアウト

    const response = await fetch(imageUrl, {
      method: 'HEAD', // ヘッダーのみ取得
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const contentType = response.headers.get('content-type')
    return response.ok && contentType !== null && contentType.startsWith('image/')
  } catch (error) {
    console.log(`画像URL検証エラー (${imageUrl}):`, error)
    return false
  }
}

// ドメイン別の代替画像マッピング
const fallbackImages: Record<string, string> = {
  'ethtokyo.org': 'https://ethtokyo.org/_next/static/media/ETHTokyoLogo.87b60934.png',
  // 他のドメインも必要に応じて追加
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  // URLの妥当性チェック
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  try {
    // タイムアウト設定付きでfetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒タイムアウト

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGP-Bot/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()

    // OGPメタデータを抽出（より柔軟な正規表現）
    const titleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    )
    const descriptionMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    )
    const imageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    )

    // フォールバック: 通常のtitleタグ
    const fallbackTitleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)

    let imageUrl = imageMatch?.[1] || ''

    // 画像URLがある場合は妥当性をチェック
    if (imageUrl) {
      const isValid = await validateImageUrl(imageUrl)
      if (!isValid) {
        console.log(`画像URLが無効です: ${imageUrl}`)
        imageUrl = '' // 無効な場合は空にする
      }
    }

    // 画像URLが無効または空の場合、ドメイン別の代替画像を試す
    if (!imageUrl) {
      const urlObj = new URL(url)
      const domain = urlObj.hostname
      const fallbackImage = fallbackImages[domain]

      if (fallbackImage) {
        const isValidFallback = await validateImageUrl(fallbackImage)
        if (isValidFallback) {
          imageUrl = fallbackImage
          console.log(`代替画像を使用: ${fallbackImage}`)
        }
      }
    }

    const ogpData = {
      title: titleMatch?.[1] || fallbackTitleMatch?.[1] || '',
      description: descriptionMatch?.[1] || '',
      image: imageUrl,
      url: url,
    }

    return NextResponse.json(ogpData)
  } catch (error) {
    console.error('OGP取得エラー:', error)

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 })
    }

    return NextResponse.json({ error: 'Failed to fetch OGP data' }, { status: 500 })
  }
}
