'use client'

import { fadeScreenStore } from '@/stores/fadeScreen.store'
import { useRouter } from 'next/navigation'

export const useNavigate = () => {
  const router = useRouter()

  const push = (href: string) => {
    router.push(href)
    // fadeScreenStore.open(() => {
    //   router.push(href)
    // })
  }

  const replace = (href: string) => {
    router.replace(href)
    // fadeScreenStore.open(() => {
    //   router.replace(href)
    // })
  }

  return { push, replace }
}
