import RegistrationForm from '@/widgets/registration'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.CLIENT_URL || 'https://inclare.ru'),
  title: 'Регистрация',
  description: 'Создайте аккаунт в соцсети Inclare',
  openGraph: {
    title: 'Регистрация',
    description: 'Создайте аккаунт в соцсети Inclare'
  }
}

const Registration = () => {
  return <RegistrationForm />
}

export default Registration
