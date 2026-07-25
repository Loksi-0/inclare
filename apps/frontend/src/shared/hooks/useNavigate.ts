'use client'

import { effectorStore } from '@/stores/effector.store'
import { fadeScreenStore } from '@/stores/fadeScreen.store'
import { useRouter } from 'next/navigation'

export const useNavigate = () => {
  const router = useRouter()

  const transition = (cmd: () => void) => {
    effectorStore.zoom(0.95)
    fadeScreenStore.open(() => {
      cmd()

      setTimeout(() => {
        effectorStore.zoom(1)
        fadeScreenStore.close()
      }, 200)
    })
  }

  const push = (href: string, options?: { animate?: boolean }) => {
    const { animate = false } = options ?? {}

    if (animate) {
      transition(() => router.push(href))
    } else {
      router.push(href)
    }
  }

  const replace = (href: string, options?: { animate?: boolean }) => {
    const { animate = false } = options ?? {}

    if (animate) {
      transition(() => router.replace(href))
    } else {
      router.replace(href)
    }
  }

  return { push, replace }
}
