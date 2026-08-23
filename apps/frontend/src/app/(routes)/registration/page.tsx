import RegistrationForm from '@/widgets/registration'
import type { Metadata } from 'next'

export const metadata: Metadata = {
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
