'use client'

import gsap from 'gsap'
import { useRef } from 'react'

type UseBlurOptions = {
  from: number
  to: number
}

type BlurFuncOpts = {
  duration?: number
}

export const useBlur = (opts: UseBlurOptions) => {
  const transitionRef = useRef({ blur: opts.from })

  const blur = (ref: HTMLElement | null, funcOpts?: BlurFuncOpts) => {
    const { duration = 0.2 } = funcOpts ?? {}

    gsap.to(transitionRef.current, {
      blur: opts.to,
      duration,
      onUpdate: () => {
        if (!ref) {
          return
        }

        ref.style.filter = `blur(${transitionRef.current.blur}px)`
      },
      onComplete: () => {
        transitionRef.current = { blur: opts.from }
      }
    })
  }

  return blur
}
