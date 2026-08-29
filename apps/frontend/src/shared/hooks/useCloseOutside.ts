'use client'

import { useEffect } from 'react'

type Props = {
  contentRefs: (HTMLElement | null)[]
  close: () => void
}

export const useCloseOutside = (props: Props) => {
  const { contentRefs, close } = props

  useEffect(() => {
    const onClick = (e: PointerEvent) => {
      const wasClickedOutside = contentRefs.reduce((prev, current) => {
        return (
          !!current &&
          e.target instanceof HTMLElement &&
          !current.contains(e.target)
        )
      }, false)

      if (wasClickedOutside) {
        close()
      }
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [contentRefs])
}
