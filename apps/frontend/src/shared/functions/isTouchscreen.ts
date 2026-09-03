import { isClient } from './isClient'

export const isTouchscreen =
  isClient && navigator ? navigator.maxTouchPoints > 0 : false
