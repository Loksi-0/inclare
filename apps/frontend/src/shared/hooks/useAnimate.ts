'use client'

import { type Dispatch, type RefObject, type SetStateAction } from 'react'

export const useAnimate = (ref: RefObject<HTMLElement | null>) => {
  const expand = (
    isExpanded: boolean,
    setIsExpanded: Dispatch<SetStateAction<boolean>>
  ) => {
    if (!ref.current) {
      return
    }

    const element = ref.current

    if (isExpanded) {
      element.style.height = '300px'
    } else {
      const scrollHeight = element.scrollHeight
      element.style.height = `${String(scrollHeight)}px`
    }

    setIsExpanded((prev) => !prev)
  }

  return {
    expand
  }
}
