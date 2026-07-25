'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.scss'
import gsap from 'gsap'

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  const scale = (scl: number) => {
    gsap.to(cursorRef.current, {
      scale: scl,
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  const reset = () => {
    gsap.to(cursorRef.current, {
      scale: 1,
      opacity: 1,
      backgroundColor: 'transparent',
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

      if (e.target instanceof HTMLElement) {
        if (Boolean(e.target.closest('[data-cursor="not-allowed"]'))) {
          gsap.to(cursorRef.current, {
            backgroundColor: 'var(--color-red)',
            scale: 0.5,
            duration: 0.5,
            ease: 'power3.out'
          })
        } else if (
          Boolean(
            e.target.closest(
              'a, button, input, textarea, [data-cursor="pointer"]'
            )
          )
        ) {
          scale(1.5)
        } else {
          reset()
        }
      }
    }

    const onLeave = () => {
      scale(0)
    }

    const onEnter = () => {
      reset()
    }

    document.documentElement.classList.add(styles.global)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
    ></div>
  )
}

export default Cursor
