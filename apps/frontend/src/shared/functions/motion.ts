import type { RefObject } from 'react'

type MotionOpts = {
  ref: RefObject<HTMLElement | null>
  state?: boolean
}

export const motion = (func: (opts: MotionOpts) => void) => func
