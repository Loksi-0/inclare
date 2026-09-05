import LoginForm from '@/screens/login'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход',
  description:
    'Минималистичная платформа для архивации фотографий с поддержкой RAW. Опубликовывайте свои и изучайте другие снимки на бесконечной 2D плоскости без лишнего соцсетевого шума',
  openGraph: {
    title: 'Вход',
    description:
      'Inclare - минималистичная платформа для архивации фотографий с лентой в виде бесконечной 2D плоскости',
    images: ['/favicon/web-app-manifest-192x192.png']
  }
}

const Login = () => {
  return <LoginForm />
}

export default Login
