import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com', 'static.zenn.studio'],
  },
}

export default nextConfig
