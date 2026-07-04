'use client'

import { useWindow } from '@/shared/hooks/useWindow'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

type UseMistedProps = {
  size: number
  delay: number
}

export const useMisted = ({ size, delay }: UseMistedProps) => {
  const { screenSize } = useWindow()
  const groupRef = useRef<SVGGElement | null>(null)
  const maskRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!groupRef.current || !maskRef.current) {
      return
    }

    const maskRect = maskRef.current.getBoundingClientRect()

    const createCicle = (cursor: { x: number; y: number }) => {
      if (!groupRef.current) {
        return
      }

      const offsetX = cursor.x - maskRect.x
      const offsetY = cursor.y - maskRect.y

      if (
        offsetX > maskRect.width ||
        offsetY > maskRect.height ||
        offsetX < 0 ||
        offsetY < 0
      ) {
        return
      }

      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      )
      circle.setAttribute('cx', String(offsetX))
      circle.setAttribute('cy', String(offsetY))
      circle.setAttribute('fill', 'black')

      groupRef.current.appendChild(circle)

      const tl = gsap.timeline({
        onComplete: () => {
          circle.remove()
        }
      })

      tl.to(circle, {
        attr: { r: size },
        duration: 0.3,
        ease: 'expo.out'
      }).to(
        circle,
        {
          attr: { r: 0 },
          duration: 5,
          delay,
          ease: 'power1.in'
        },
        `+=${delay}`
      )
    }

    const onMouseMove = (e: MouseEvent) => {
      createCicle({
        x: e.x,
        y: e.y
      })
    }
    const onTouchMove = (e: TouchEvent) => {
      createCicle({
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [screenSize])

  return { groupRef, maskRef }
}
