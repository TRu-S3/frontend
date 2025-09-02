// API関連の定数
export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-696136807010.asia-northeast1.run.app',
  TIMEOUT: 10000, // 10秒
  RETRY_ATTEMPTS: 3,
} as const

// 日付フォーマットの定数
export const DATE_FORMATS = {
  JAPANESE: {
    year: 'numeric' as const,
    month: 'short' as const,
    day: 'numeric' as const,
  },
} as const

// エラーメッセージの定数
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNAUTHORIZED: '認証が必要です',
  NOT_FOUND: 'リソースが見つかりません',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  PROFILE_NOT_FOUND: 'プロフィールが見つかりません',
  PROFILE_FETCH_FAILED: 'プロフィールの取得に失敗しました',
  PROFILE_CREATE_FAILED: 'プロフィールの作成に失敗しました',
  PROFILE_UPDATE_FAILED: 'プロフィールの更新に失敗しました',
  PROFILE_DELETE_FAILED: 'プロフィールの削除に失敗しました',
} as const 