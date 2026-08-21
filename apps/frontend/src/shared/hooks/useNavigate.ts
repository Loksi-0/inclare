'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const useNavigate = () => {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const transition = (action: () => void) => {
    if (!document.startViewTransition) {
      action()
      return
    }

    document.startViewTransition(() => {
      startTransition(() => {
        action()
      })
    })
  }

  const push = (href: string) => {
    transition(() => router.push(href))
  }

  const replace = (href: string) => {
    transition(() => router.replace(href))
  }

  const back = () => {
    transition(() => router.back())
  }

  return { push, replace, back }
}
