import type { NextConfig } from 'next'

const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${String(backendUrl)}/uploads/:path*`
      }
    ]
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: process.env.IGNORE_BUILD_TYPE_ERRORS === 'true'
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'inclare.ru',
        port: '',
        pathname: '/uploads/**'
      }
    ],
    localPatterns: [
      { pathname: '/api/proxy-image' },
      { pathname: '/uploads/**' }
    ]
  }
}

export default nextConfig
