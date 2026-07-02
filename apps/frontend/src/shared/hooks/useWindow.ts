'use client'

import { useEffect, useState } from 'react'
import { isClient } from '../functions/isClient'

export const useWindow = () => {
  const [screenSize, setScreenSize] = useState(
    isClient ? window.innerWidth : null
  )

  useEffect(() => {
    const onResize = () => {
      setScreenSize(window.innerWidth)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    screenSize
  }
}
