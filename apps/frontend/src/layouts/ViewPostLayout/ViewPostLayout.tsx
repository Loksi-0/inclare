import { useEffect, type PropsWithChildren } from 'react'
import styles from './ViewPostLayout.module.scss'
import { postStore } from '@/stores/post.store'
import { mainStore } from '@/stores/main.store'

type ViewPostLayoutProps = PropsWithChildren<{
  height: number
  zIndex?: number
}>

const ViewPostLayout = (props: ViewPostLayoutProps) => {
  const { height, children, zIndex } = props

  useEffect(() => {
    if (!mainStore.mainRef) {
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

    mainStore.mainRef.addEventListener('click', onClick)

    return () => {
      mainStore.mainRef?.removeEventListener('click', onClick)
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
      <div className={styles.post__inner}>{children}</div>
    </section>
  )
}

export default ViewPostLayout
