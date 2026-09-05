'use client'

import { useEffect, useRef } from 'react'
import { useBlur } from './useBlur'
import { timelineStore } from '@/features/timeline'
import { UI } from '@/constants'
import { postStore } from '@/features/post'
import gsap from 'gsap'
import { uploadStore } from '@/features/upload'

export const useOpenPost = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  const blurIn = useBlur({ from: 0, to: 5 })
  const blurOut = useBlur({ from: 5, to: 0 })

  const isOpen = postStore.isOpen || uploadStore.isOpen

  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (!timelineStore.timelineRef) {
      blurOut(ref.current)
      gsap.to(ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      return
    }

    const timelineRect = timelineStore.timelineRef.getBoundingClientRect()
    const offset =
      window.innerHeight -
      (timelineRect.y + timelineRect.height) -
      UI.TIMELINE_PADDING

    if (isOpen) {
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
  }, [isOpen])

  return ref
}
