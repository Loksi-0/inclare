import LoginForm from '@/widgets/login'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Войдите в аккаунт в Inclare',
  openGraph: {
    title: 'Вход',
    description: 'Войдите в аккаунт в Inclare'
  }
}

const Login = () => {
  return <LoginForm />
}

export default Login
