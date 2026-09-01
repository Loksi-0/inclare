'use client'

import Header from '@/components/Header'
import { type PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './PageLayout.module.scss'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { postStore } from '@/stores/post.store'
import { photoModalStore } from '@/stores/photoModal.store'
import { imageModalStore } from '@/stores/imageModal.store'

type PageLayoutProps = PropsWithChildren<{
  profile?: boolean
  padding?: boolean
  plane?: boolean
  settings?: boolean
  className?: string
  overflow?: boolean
  gestures?: {
    back?: string
    forward?: string
  }
}>

const PageLayout = (props: PageLayoutProps) => {
  const {
    children,
    className,
    settings = false,
    profile = false,
    padding = false,
    plane = false,
    overflow = false,
    gestures
  } = props

  const { push, back } = useNavigate()

  useSwipe({
    strength: 'medium',
    onLeftToRight: () => {
      if (
        !gestures?.back ||
        postStore.isOpen ||
        photoModalStore.isOpen ||
        imageModalStore.isOpen
      ) {
        return
      }

      if (gestures.back === 'back') {
        back()
      } else {
        push(gestures.back)
      }
    },
    onRightToLeft: () => {
      if (
        !gestures?.forward ||
        postStore.isOpen ||
        photoModalStore.isOpen ||
        imageModalStore.isOpen
      ) {
        return
      }

      push(gestures.forward)
    }
  })

  return (
    <div className={cx(styles.layout, [{ [styles.plane]: plane }])}>
      <Header />
      <main
        className={cx(styles.layout__main, className, [
          { [styles.profile]: profile },
          { [styles.padding]: padding },
          { [styles.overflow]: overflow },
          { [styles.plane]: plane },
          { [styles.settings]: settings }
        ])}
      >
        {children}
      </main>
    </div>
  )
}

export default PageLayout
