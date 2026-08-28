import { useEffect, useRef, type PropsWithChildren } from 'react'
import styles from './ViewPostLayout.module.scss'
import { postStore } from '@/stores/post.store'
import { pageStore } from '@/stores/page.store'

type ViewPostLayoutProps = PropsWithChildren<{
  height: number
  zIndex?: number
}>

const ViewPostLayout = (props: ViewPostLayoutProps) => {
  const { height, children, zIndex } = props

  const viewPostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!pageStore.pageRef) {
      return
    }

    const onClick = (e: PointerEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !e.target.closest('button, a, img, svg') &&
        postStore.canCloseOutside
      ) {
        postStore.close()
      }
    }

    pageStore.pageRef.addEventListener('click', onClick)

    return () => {
      pageStore.pageRef?.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <section
      ref={viewPostRef}
      className={styles.post}
      style={{
        height: `${height}px`,
        zIndex
      }}
    >
      <div className={styles.post__inner}>{children}</div>
    </section>
  )
}

export default ViewPostLayout
