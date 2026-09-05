'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { useBlur } from '@/shared/hooks/useBlur'
import { motion } from '@/shared/functions/motion'

export const useAppearMotion = motion(({ ref, state }) => {
  const blurOut = useBlur({ from: 10, to: 0 })
  const blurIn = useBlur({ from: 0, to: 10 })

  useEffect(() => {
    if (state) {
      blurOut(ref.current)
      gsap.set(ref.current, { display: 'flex' })
      gsap.to(ref.current, {
        opacity: 1,
        duration: 0.2
      })
    } else {
      blurIn(ref.current)
      gsap.to(ref.current, {
        opacity: 0,
        duration: 0.2,
        display: 'none'
      })
    }
  }, [state])
})
