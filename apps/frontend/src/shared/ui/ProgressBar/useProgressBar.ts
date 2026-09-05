'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export const useProgressBar = (percentage: number) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const [charWidth, setCharWidth] = useState(8.5)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || !measureRef.current) {
      return
    }

    const measureWidth = measureRef.current.getBoundingClientRect().width

    if (measureWidth > 0) {
      setCharWidth(measureWidth)
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  const dots = useMemo(() => {
    if (containerWidth <= 0 || charWidth <= 0) {
      return ''
    }

    const bracketsWidth = charWidth * 2
    const availableWidth = containerWidth - bracketsWidth

    const totalDots = Math.max(availableWidth / charWidth, 0)

    const clampedProgress = Math.min(Math.max(percentage, 0), 100)
    const activeCount = Math.round(totalDots * (clampedProgress / 100))

    return '.'.repeat(activeCount)
  }, [containerWidth, charWidth, percentage])

  return {
    containerRef,
    measureRef,
    dots
  }
}
