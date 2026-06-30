const nextConfig = {
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
    unoptimized: process.env.UNOPTIMIZE_IMAGES === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'inclare.ru',
        port: '',
        pathname: '/uploads/**',
        search: ''
      }
    ]
  }
}

export default nextConfig
