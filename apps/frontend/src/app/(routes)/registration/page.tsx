import RegistrationForm from '@/screens/registration'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация',
  description:
    'Минималистичная платформа для архивации фотографий с поддержкой RAW. Опубликовывайте свои и изучайте другие снимки на бесконечной 2D плоскости без лишнего соцсетевого шума',
  openGraph: {
    title: 'Регистрация',
    description:
      'Inclare - минималистичная платформа для архивации фотографий с лентой в виде бесконечной 2D плоскости',
    images: ['/favicon/web-app-manifest-192x192.png']
  }
}

const Registration = () => {
  return <RegistrationForm />
}

export default Registration
