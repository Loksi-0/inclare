'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.scss'
import gsap from 'gsap'
import { CURSOR } from '@/constants'

export const useCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef<EventTarget | null>(null)
  const isMouseDownRef = useRef(false)

  const checkClosest = (cursor: string, elements?: string) => {
    if (targetRef.current instanceof HTMLElement) {
      return Boolean(
        targetRef.current.closest(`${elements}, [data-cursor="${cursor}"]`)
      )
    }

    return false
  }

  const scale = (scl: number) => {
    gsap.to(cursorRef.current, {
      scale: scl,
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  const reset = (disableScale: boolean = false) => {
    gsap.to(cursorRef.current, {
      scale: disableScale ? undefined : 1,
      opacity: 1,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderRadius: '50px',
      rotate: '45deg',
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  useEffect(() => {
    const xTo = gsap.quickTo(cursorRef.current, 'x', {
      duration: 0.01,
      ease: 'power3.out'
    })
    const yTo = gsap.quickTo(cursorRef.current, 'y', {
      duration: 0.01,
      ease: 'power3.out'
    })

    xTo(-10)
    yTo(-10)
    scale(0)

    const onMove = (e: MouseEvent) => {
      xTo(e.x)
      yTo(e.y)

      targetRef.current = e.target

      if (checkClosest(CURSOR.GRAB)) {
        gsap.to(cursorRef.current, {
          borderRadius: '0px',
          duration: 0.5,
          ease: 'power3.out'
        })
      } else if (checkClosest(CURSOR.NOT_ALLOWED)) {
        gsap.to(cursorRef.current, {
          backgroundColor: 'var(--color-red)',
          scale: 0.5,
          duration: 0.5,
          ease: 'power3.out'
        })
      } else if (
        checkClosest(CURSOR.POINTER, 'a, button, input, textarea') &&
        !isMouseDownRef.current
      ) {
        reset(true)
        scale(1.5)
      } else {
        reset(isMouseDownRef.current)
      }
    }

    const onLeave = () => {
      scale(0)
    }

    const onEnter = () => {
      reset()
    }

    const onDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDownRef.current = true
        scale(0.75)
      }
    }

    const onUp = () => {
      isMouseDownRef.current = false
      scale(1)
    }

    document.documentElement.classList.add(styles.global)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return { cursorRef }
}
