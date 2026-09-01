import { useEffect, useRef, type PropsWithChildren } from 'react'
import styles from './ViewPostLayout.module.scss'
import { postStore } from '@/stores/post.store'
import { mainStore } from '@/stores/main.store'
import { useFluid } from '@/shared/hooks/useFluid'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { observer } from 'mobx-react-lite'

type ViewPostLayoutProps = PropsWithChildren<{
  height: number
  zIndex?: number
}>

const ViewPostLayout = observer((props: ViewPostLayoutProps) => {
  const { height, children, zIndex } = props

  const innerRef = useRef<HTMLDivElement | null>(null)

  useSwipe({
    touchDelta: 40,
    timeDelta: 200,
    onTopToBottom: () => {
      if (postStore.scrollPosition < 10) {
        postStore.close()
      }
    }
  })

  const SCROLL_DOWN_THRESHOLD = useFluid(200, 400)
  const SCROLL_UP_THRESHOLD = 20

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

        if (e.target.scrollTop < SCROLL_UP_THRESHOLD && postStore.isFullyOpen) {
          postStore.closeFull()
        }
      }
    }

    mainStore.mainRef.addEventListener('click', onClick)
    innerRef.current.addEventListener('scroll', onScroll)

    return () => {
      mainStore.mainRef?.removeEventListener('click', onClick)
      innerRef.current?.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      className={styles.post}
      style={{
        height: `${height}px`,
        zIndex
      }}
    >
      <div
        ref={innerRef}
        className={styles.post__inner}
      >
        {children}
      </div>
    </section>
  )
})

export default ViewPostLayout
