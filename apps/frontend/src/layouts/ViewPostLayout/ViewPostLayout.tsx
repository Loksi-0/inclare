import { useEffect, useRef, type PropsWithChildren } from 'react'
import styles from './ViewPostLayout.module.scss'
import { postStore } from '@/stores/post.store'
import { mainStore } from '@/stores/main.store'
import { useFluid } from '@/shared/hooks/useFluid'

type ViewPostLayoutProps = PropsWithChildren<{
  height: number
  zIndex?: number
}>

const ViewPostLayout = (props: ViewPostLayoutProps) => {
  const { height, children, zIndex } = props

  const innerRef = useRef<HTMLDivElement | null>(null)

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
        if (
          e.target.scrollHeight > window.innerHeight &&
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
}

export default ViewPostLayout
