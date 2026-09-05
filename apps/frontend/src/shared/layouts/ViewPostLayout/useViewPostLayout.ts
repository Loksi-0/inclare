import { useEffect, useRef } from 'react'
import { postStore } from '@/features/post/post.store'
import { mainStore } from '@/features/main/main.store'
import { useFluid } from '@/shared/hooks/useFluid'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { photoModalStore } from '@/features/photoModal/photoModal.store'
import { preferencesStore } from '@/shared/stores/preferences.store'
import { uploadStore } from '@/features/upload'

export const useViewPostLayout = () => {
  const SCROLL_DOWN_THRESHOLD = useFluid(200, 400)
  const WHEEL_THRESHOLD = 10

  const innerRef = useRef<HTMLDivElement | null>(null)

  const handleGesture = () => {
    if (
      (postStore.isOpen || uploadStore.isOpen) &&
      !photoModalStore.isOpen &&
      !photoModalStore.isClosing &&
      !uploadStore.isAnimating &&
      !postStore.isAnimating &&
      postStore.scrollPosition < 10
    ) {
      if (postStore.isFullyOpen) {
        postStore.closeFull()
      } else {
        postStore.close()
        uploadStore.close()
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
        uploadStore.close()
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

  useEffect(() => {
    if (postStore.isOpen && innerRef.current) {
      innerRef.current.scroll({ top: 0 })
    }
  }, [postStore.isOpen, postStore.postId])

  return { innerRef }
}
