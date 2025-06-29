import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'static.zenn.studio',
      'ethtokyo.org',
      'connpass.com',
      'atnd.org',
      'efc.fukuoka.jp',
      's.yimg.jp',
    ],
  },
}

export default nextConfig
