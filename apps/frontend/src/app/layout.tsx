import type { Metadata, Viewport } from 'next'
import { Playfair_Display, PT_Serif, Geist_Mono } from 'next/font/google'
import cx from 'clsx'
import App from './App'
import './styles/index.scss'

const playfairDisplay = Playfair_Display({
  variable: '--font-family-accent',
  weight: '600',
  subsets: ['latin', 'cyrillic']
})

const ptSerif = PT_Serif({
  variable: '--font-family-base',
  weight: '400',
  subsets: ['latin', 'cyrillic-ext']
})

const geistMono = Geist_Mono({
  variable: '--font-family-mono',
  weight: '400',
  subsets: ['latin', 'cyrillic']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.CLIENT_URL || 'https://inclare.ru'),
  title: 'Inclare',
  description:
    'Минималистичная платформа для архивации фотографий с поддержкой RAW. Опубликовывайте свои и изучайте другие снимки на бесконечной 2D плоскости без лишнего соцсетевого шума',
  openGraph: {
    title: 'Inclare',
    description:
      'Минималистичная платформа для архивации фотографий с лентой в виде бесконечной 2D плоскости',
    images: ['/favicon/web-app-manifest-192x192.png']
  },
  icons: {
    icon: [
      {
        url: '/favicon/favicon-light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)'
      },
      {
        url: '/favicon/favicon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)'
      },
      {
        url: '/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      }
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest'
      }
    ]
  },
  other: {
    'apple-mobile-web-app-title': 'Inclare'
  }
}

const Root = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang='ru'>
      <body
        className={cx(
          playfairDisplay.variable,
          ptSerif.variable,
          geistMono.variable
        )}
      >
        <App>{children}</App>
      </body>
    </html>
  )
}

export default Root
