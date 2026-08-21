import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${String(process.env.NEXT_PUBLIC_API_URL)}/uploads/:path*`
      }
    ]
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: process.env.IGNORE_BUILD_TYPE_ERRORS === 'true'
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.UNOPTIMIZE_IMAGES === 'true',
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
