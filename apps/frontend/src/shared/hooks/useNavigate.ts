'use client'

import { useRouter } from 'next/navigation'

export const useNavigate = () => {
  const router = useRouter()

  const push = (href: string) => {
    router.push(href)
  }

  const replace = (href: string) => {
    router.replace(href)
  }

  return { push, replace }
}
