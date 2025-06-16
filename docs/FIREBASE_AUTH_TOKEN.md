# Firebase Auth Token 管理

Firebase Authenticationの idToken を自動管理し、APIリクエストにBearerトークンとして追加する機能です。

## 機能

- **自動トークン管理**: localStorage への保存・取得・削除
- **期限チェック**: トークンの有効期限を自動確認
- **自動リフレッシュ**: 期限切れ時の自動更新
- **汎用APIクライアント**: 認証が必要なAPIの簡単呼び出し

## 使用方法

### 1. トークン関数を直接使用

```typescript
import { getIdToken, hasValidToken, clearIdToken } from '@/lib/auth-token'

// トークンを取得（自動リフレッシュ付き）
const token = await getIdToken()

// 有効なトークンがあるかチェック
const isValid = hasValidToken()

// トークンをクリア
clearIdToken()
```

### 2. APIクライアントを使用（推奨）

```typescript
import { apiClient } from '@/lib/api-client'

// GET リクエスト（認証あり）
const data = await apiClient.get('/api/users/profile')

// POST リクエスト（認証あり）
const result = await apiClient.post('/api/users/update', { name: 'New Name' })

// 認証なしのリクエスト
const publicData = await apiClient.get('/api/public', false)
```

### 3. TanStack Query との組み合わせ

```typescript
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.get('/api/users/profile'),
  })
}
```

## API エンドポイントでの検証

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/features/auth/firebase/admin'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const idToken = authHeader.substring(7)
    const decodedToken = await auth.verifyIdToken(idToken)
    
    // 認証成功
    return NextResponse.json({ 
      message: 'Success',
      user: decodedToken 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

## エラーハンドリング

```typescript
import { ApiError } from '@/lib/api-client'

try {
  const data = await apiClient.get('/api/protected')
} catch (error) {
  if (error instanceof ApiError) {
    console.log(`API Error: ${error.status} - ${error.message}`)
  }
}
```

## 自動動作

1. **ログイン時**: トークンがlocalStorageに自動保存される
2. **API呼び出し時**: 
   - 保存されたトークンをチェック
   - 有効期限内なら使用
   - 期限切れなら自動リフレッシュ
3. **ログアウト時**: トークンが自動削除される

## セキュリティ

- トークンは5分のバッファを設けて有効期限をチェック
- サーバーサイドでも Firebase Admin SDK による検証を実施
- ログアウト時の確実なトークンクリア 