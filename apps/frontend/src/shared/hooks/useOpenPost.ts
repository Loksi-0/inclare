'use client'

import { useEffect, useRef } from 'react'
import { useBlur } from './useBlur'
import { timelineStore } from '@/features/timeline'
import { UI } from '@/constants'
import { postStore } from '@/features/post'
import gsap from 'gsap'

export const useOpenPost = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  const blurIn = useBlur({ from: 0, to: 5 })
  const blurOut = useBlur({ from: 5, to: 0 })

  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (!timelineStore.timelineRef.current) {
      blurOut(ref.current)
      gsap.to(ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      return
    }

    const timelineRect =
      timelineStore.timelineRef.current.getBoundingClientRect()

    const offset =
      window.innerHeight -
      (timelineRect.y + timelineRect.height) -
      UI.TIMELINE_PADDING

    if (postStore.isOpenSignal) {
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
      gsap.to(timelineStore.timelineRef.current, animationOptions)
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
      gsap.to(timelineStore.timelineRef.current, animationOptions)
    }
  }, [postStore.isOpenSignal])

  return ref
}
