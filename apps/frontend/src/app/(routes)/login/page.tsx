import LoginForm from '@/widgets/login'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Войдите в аккаунт в Inclare',
  openGraph: {
    title: 'Вход',
    description: 'Войдите в аккаунт в Inclare',
    images: ['/favicon/web-app-manifest-192x192.png']
  }
}

const Login = () => {
  return <LoginForm />
}

export default Login
