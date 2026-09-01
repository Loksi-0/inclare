import { useEffect, useRef } from 'react'
import { postStore } from '@/stores/post.store'
import { mainStore } from '@/stores/main.store'
import { useFluid } from '@/shared/hooks/useFluid'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { photoModalStore } from '@/stores/photoModal.store'
import { preferencesStore } from '@/stores/preferences.store'

export const useViewPostLayout = () => {
  const SCROLL_DOWN_THRESHOLD = useFluid(200, 400)
  const WHEEL_THRESHOLD = 10

  const innerRef = useRef<HTMLDivElement | null>(null)

  const handleGesture = () => {
    if (
      postStore.isOpen &&
      !photoModalStore.isOpen &&
      !photoModalStore.isClosing &&
      postStore.scrollPosition < 10
    ) {
      if (postStore.isFullyOpen) {
        postStore.closeFull()
      } else {
        postStore.close()
      }
    }
  }

  useSwipe({
    strength: 'light',
    onTopToBottom: handleGesture
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
      if (e.deltaY < WHEEL_THRESHOLD * -1 && preferencesStore.enableGestures) {
        handleGesture()
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
