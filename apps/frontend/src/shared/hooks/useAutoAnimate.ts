'use client'

import { useEffect, useRef } from 'react'

export const useAutoAnimate = <T extends HTMLElement = HTMLDivElement>(
  trackFields: unknown[],
  options?: {
    width?: boolean
    height?: boolean
  }
) => {
  const isWidth = options?.width ?? true
  const isHeight = options?.height ?? true

  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (!ref.current || !isHeight) {
      return
    }

    const element = ref.current

    const prevHeight = element.clientHeight
    element.style.height = 'auto'
    const newHeight = element.clientHeight

    element.style.height = `${String(prevHeight)}px`

    requestAnimationFrame(() => {
      element.style.height = `${String(newHeight)}px`
    })
  }, trackFields)

  useEffect(() => {
    if (!ref.current || !isWidth) {
      return
    }

    const element = ref.current

    const prevWidth = element.clientWidth + 1
    element.style.width = 'auto'
    const newWidth = element.clientWidth + 1

    element.style.width = `${String(prevWidth)}px`

    requestAnimationFrame(() => {
      element.style.width = `${String(newWidth)}px`
    })
  }, trackFields)

  return ref
}
