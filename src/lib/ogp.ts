interface OGPData {
  title?: string
  description?: string
  image?: string
  url?: string
}

export async function getOGPData(url: string): Promise<OGPData> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    // OGPメタデータを抽出
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/)
    const descriptionMatch = html.match(/<meta property="og:description" content="([^"]+)"/)
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/)
    
    return {
      title: titleMatch?.[1] || '',
      description: descriptionMatch?.[1] || '',
      image: imageMatch?.[1] || '',
      url: url
    }
  } catch (error) {
    console.error('OGP取得エラー:', error)
    return {}
  }
}

// 複数URLのOGPデータを並行取得
export async function getMultipleOGPData(urls: string[]): Promise<Record<string, OGPData>> {
  const promises = urls.map(async (url) => {
    const ogpData = await getOGPData(url)
    return { url, ogpData }
  })
  
  const results = await Promise.all(promises)
  
  return results.reduce((acc, { url, ogpData }) => {
    acc[url] = ogpData
    return acc
  }, {} as Record<string, OGPData>)
} 