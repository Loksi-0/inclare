'use client'

import { useWindow } from './useWindow'

export const useFluid = (min: number, max: number) => {
  const { screenSize } = useWindow()

  if (!screenSize) {
    return max
  }

  const minWidth = 360
  const maxWidth = 1920

  const width =
    screenSize < minWidth
      ? minWidth
      : screenSize > maxWidth
        ? maxWidth
        : screenSize

  const coef = (width - minWidth) / (maxWidth - minWidth)

  return (max - min) * coef + min
}
