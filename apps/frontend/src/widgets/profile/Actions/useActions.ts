'use client'

import { TIMELINE_PADDING } from '@/constants'
import { useTRPC } from '@/api/tanstack'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { postStore } from '@/stores/post.store'
import gsap from 'gsap'
import { timelineStore } from '@/stores/timeline.store'
import { useBlur } from '@/shared/hooks/useBlur'

export const useActions = (initialData: number) => {
  const actionsRef = useRef<HTMLDivElement | null>(null)
  const trpc = useTRPC()
  const { data: draftedLength } = useQuery(
    trpc.post.my.getDraftedLength.queryOptions(undefined, { initialData })
  )
  const blurIn = useBlur({ from: 0, to: 5 })
  const blurOut = useBlur({ from: 5, to: 0 })

  useEffect(() => {
    if (!timelineStore.timelineRef || !actionsRef.current) {
      return
    }

    const timelineRect = timelineStore.timelineRef.getBoundingClientRect()
    const offset =
      window.innerHeight -
      (timelineRect.y + timelineRect.height) -
      TIMELINE_PADDING

    if (postStore.isOpen) {
      const animationOptions: gsap.TweenVars = {
        y: offset,
        ease: 'power2.out',
        duration: 0.5
      }

      blurIn(actionsRef.current)
      gsap.to(actionsRef.current, {
        ...animationOptions,
        opacity: 0
      })
      gsap.to(timelineStore.timelineRef, animationOptions)
    } else {
      const animationOptions: gsap.TweenVars = {
        y: 0,
        ease: 'power2.out',
        duration: 0.5
      }

      blurOut(actionsRef.current)
      gsap.to(actionsRef.current, {
        ...animationOptions,
        opacity: 1
      })
      gsap.to(timelineStore.timelineRef, animationOptions)
    }
  }, [postStore.isOpen])

  return {
    actionsRef,
    draftedLength,
    isPostOpen: postStore.isOpen
  }
}
