import { useEffect, useRef } from 'react'
import { postStore } from '@/stores/post.store'
import { mainStore } from '@/stores/main.store'
import { useFluid } from '@/shared/hooks/useFluid'
import { useSwipe } from '@/shared/hooks/useSwipe'

export const useViewPostLayout = () => {
  const SCROLL_DOWN_THRESHOLD = useFluid(200, 400)
  const WHEEL_THRESHOLD = 10

  const innerRef = useRef<HTMLDivElement | null>(null)

  useSwipe({
    strength: 'light',
    onTopToBottom: () => {
      if (postStore.scrollPosition < 50) {
        if (postStore.isFullyOpen) {
          postStore.closeFull()
        } else {
          postStore.close()
        }
      }
    }
  })

  useEffect(() => {
    if (!mainStore.mainRef || !innerRef.current) {
      return
    }

    const onClick = (e: PointerEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !e.target.closest('a, button') &&
        postStore.canCloseOutside
      ) {
        postStore.close()
      }
    }

    const onScroll = (e: Event) => {
      if (e.target instanceof HTMLElement) {
        postStore.setScrollPosition(e.target.scrollTop)

        if (
          e.target.scrollHeight > window.innerHeight * 1.5 &&
          e.target.scrollTop > SCROLL_DOWN_THRESHOLD &&
          !postStore.isFullyOpen
        ) {
          postStore.openFull()
          return
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (
        e.deltaY < WHEEL_THRESHOLD * -1 &&
        postStore.isOpen &&
        postStore.scrollPosition < 10
      ) {
        if (postStore.isFullyOpen) {
          postStore.closeFull()
        } else {
          postStore.close()
        }
      }
    }

    mainStore.mainRef.addEventListener('click', onClick)
    innerRef.current.addEventListener('scroll', onScroll)
    window.addEventListener('wheel', onWheel)

    return () => {
      mainStore.mainRef?.removeEventListener('click', onClick)
      innerRef.current?.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return { innerRef }
}
