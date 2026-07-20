'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { isTouchscreen } from '../functions/isTouchscreen'

type Options = {
  bgCoefficient?: number
  topCoefficient?: number
  reversed?: boolean
}

const animationOptions: gsap.TweenVars = {
  duration: 0.8,
  ease: 'power4.out'
}

export const useParallax = (options: Options = {}) => {
  const { bgCoefficient = 1, topCoefficient = 2, reversed = false } = options

  const bgRef = useRef<HTMLDivElement | null>(null)
  const topRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const bgX = gsap.quickTo(bgRef.current, 'x', animationOptions)
    const bgY = gsap.quickTo(bgRef.current, 'y', animationOptions)

    const topX = gsap.quickTo(topRef.current, 'x', animationOptions)
    const topY = gsap.quickTo(topRef.current, 'y', animationOptions)

    const onMove = (e: MouseEvent) => {
      if (isTouchscreen) {
        return
      }

      const bgCoef = bgCoefficient / 100
      const topCoef = topCoefficient / 100

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      const cursorX = e.clientX
      const cursorY = e.clientY

      if (bgRef) {
        const offsetBgX = (cursorX - centerX) * (reversed ? -1 : 1) * bgCoef
        const offsetBgY = (cursorY - centerY) * (reversed ? -1 : 1) * bgCoef

        bgX(offsetBgX)
        bgY(offsetBgY)
      }

      if (topRef) {
        const offsetTopX = (cursorX - centerX) * (reversed ? -1 : 1) * topCoef
        const offsetTopY = (cursorY - centerY) * (reversed ? -1 : 1) * topCoef

        topX(offsetTopX)
        topY(offsetTopY)
      }
    }

    const onLeave = () => {
      if (bgRef) {
        bgX(0)
        bgY(0)
      }

      if (topRef) {
        topX(0)
        topY(0)
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return { bgRef, topRef }
}
