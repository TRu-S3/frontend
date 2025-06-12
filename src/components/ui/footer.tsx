import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* ロゴとサービス説明 */}
          <div className='col-span-1'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>MY</span>
              </div>
              <span className='text-xl font-bold text-gray-900'>App</span>
            </div>
            <p className='text-gray-600 text-sm'>シンプルで使いやすいWebアプリケーションです。</p>
          </div>

          {/* リンク */}
          <div className='col-span-1'>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>サービス</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  ダッシュボード
                </Link>
              </li>
              <li>
                <Link
                  href='/signin'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  ログイン
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div className='col-span-1'>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>サポート</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  ヘルプ
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 下部のコピーライト */}
        <div className='border-t border-gray-200 mt-8 pt-6'>
          <p className='text-sm text-gray-500 text-center'>© 2025 MyApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
