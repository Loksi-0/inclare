'use client'

import { useEffect, useState } from 'react'
import { useWindow } from './useWindow'
import { useIsMounted } from './useIsMounted'

export const useMedia = () => {
  const { screenSize } = useWindow()
  const [values, setValues] = useState({
    isMobileSmall: false,
    isMobile: false,
    isTablet: false,
    isLaptopSmall: false,
    isLaptop: false,
    isDesktop: false,
    isMobileSmallAbove: false,
    isMobileAbove: false,
    isTabletAbove: false,
    isLaptopSmallAbove: false,
    isLaptopAbove: false,
    isDesktopAbove: false
  })
  const { isMounted } = useIsMounted()

  useEffect(() => {
    const onMount = () => {
      if (!screenSize) {
        return
      }

      setValues({
        isMobileSmall: screenSize <= 480,
        isMobile: screenSize <= 830 && screenSize > 480,
        isTablet: screenSize <= 1024 && screenSize > 830,
        isLaptopSmall: screenSize <= 1150 && screenSize > 1024,
        isLaptop: screenSize <= 1440 && screenSize > 1150,
        isDesktop: screenSize > 1440,
        isMobileSmallAbove: screenSize > 480,
        isMobileAbove: screenSize > 830,
        isTabletAbove: screenSize > 1024,
        isLaptopSmallAbove: screenSize > 1150,
        isLaptopAbove: screenSize > 1440,
        isDesktopAbove: screenSize > 1920
      })
    }

    onMount()
  }, [screenSize])

  return {
    isMounted,
    ...values
  }
}
