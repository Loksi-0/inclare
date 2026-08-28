import RegistrationForm from '@/widgets/registration'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт в соцсети Inclare',
  openGraph: {
    title: 'Регистрация',
    description: 'Создайте аккаунт в соцсети Inclare',
    images: ['/favicon/web-app-manifest-192x192.png']
  }
}

const Registration = () => {
  return <RegistrationForm />
}

export default Registration
