'use client'

import { useEffect, useRef } from 'react'
import { useBlur } from './useBlur'
import { timelineStore } from '@/stores/timeline.store'
import { TIMELINE_PADDING } from '@/constants'
import { postStore } from '@/stores/post.store'
import gsap from 'gsap'

export const useOpenPost = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  const blurIn = useBlur({ from: 0, to: 5 })
  const blurOut = useBlur({ from: 5, to: 0 })

  useEffect(() => {
    if (!timelineStore.timelineRef || !ref.current) {
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

      blurIn(ref.current)
      gsap.to(ref.current, {
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

      blurOut(ref.current)
      gsap.to(ref.current, {
        ...animationOptions,
        opacity: 1
      })
      gsap.to(timelineStore.timelineRef, animationOptions)
    }
  }, [postStore.isOpen])

  return ref
}
