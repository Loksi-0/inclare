'use client'

import { randomInt } from '@/shared/functions/randomInt'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export const useGradient = () => {
  const [radius, setRadius] = useState(100)
  const containerRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const containerWidth = containerRef.current.getBoundingClientRect().width
    setRadius(containerWidth / 1.3)

    const blobs = containerRef.current.querySelectorAll('circle')

    blobs.forEach((b) => {
      gsap.set(b, { cx: `${randomInt(0, 100)}%`, cy: `${randomInt(0, 100)}%` })
    })

    const blobAnims = Array.from(blobs).map(() => {
      return {
        timeX: randomInt(0, 1000),
        timeY: randomInt(0, 1000),

        speedX: randomInt(3, 8) / 1000,
        speedY: randomInt(3, 8) / 1000,

        ampX: randomInt(20, 45),
        ampY: randomInt(20, 45),

        xTo: gsap.quickTo(blobs, 'xPercent', {
          duration: randomInt(1, 3),
          ease: 'power1.out'
        }),
        yTo: gsap.quickTo(blobs, 'yPercent', {
          duration: randomInt(1, 3),
          ease: 'power1.out'
        })
      }
    })

    const tickHandler = () => {
      blobAnims.forEach((anim) => {
        anim.timeX += anim.speedX
        anim.timeY += anim.speedY

        const targetX = Math.sin(anim.timeX) * anim.ampX
        const targetY = Math.cos(anim.timeY) * anim.ampY

        anim.xTo(targetX)
        anim.yTo(targetY)
      })
    }
    gsap.ticker.add(tickHandler)

    return () => {
      gsap.ticker.remove(tickHandler)
    }
  }, [])

  return {
    containerRef,
    radius
  }
}
