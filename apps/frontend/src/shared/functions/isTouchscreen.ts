import { isClient } from './isClient'

export const isTouchscreen = isClient
  ? 'ontouchstart' in window || navigator.maxTouchPoints > 0
  : navigator.maxTouchPoints > 0
