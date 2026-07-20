'use client'

import { isTouchscreen } from '@/shared/functions/isTouchscreen'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

const EyeOpen = () => {
  const eyeRef = useRef<SVGRectElement | null>(null)

  useEffect(() => {
    if (isTouchscreen || !eyeRef.current) {
      return
    }

    const eyeXTo = gsap.quickTo(eyeRef.current, 'x', {
      duration: 0.1
    })
    const eyeYTo = gsap.quickTo(eyeRef.current, 'y', {
      duration: 0.1
    })

    const onMove = (e: MouseEvent) => {
      if (!eyeRef.current) {
        return
      }

      const xOffset = Math.floor((e.x / window.innerWidth) * 100) / 10 - 5
      const YOffset = Math.floor((e.y / window.innerHeight) * 100) / 100 - 0.5

      eyeXTo(xOffset)
      eyeYTo(YOffset)
    }

    const onLeave = () => {
      eyeXTo(0)
      eyeYTo(0)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <svg
      className='svg-icon'
      width='25'
      height='15'
      viewBox='0 0 25 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9 4V11H16V4H9Z'
        ref={eyeRef}
        fill='#1A1F21'
      />
      <path
        d='M25 0V15H0V0H25ZM2 13H23V2H2V13Z'
        fill='#1A1F21'
      />
    </svg>
  )
}

export default EyeOpen
