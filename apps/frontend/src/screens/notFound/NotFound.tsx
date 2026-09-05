'use client'

import Logo from '@/shared/icons/Logo'
import Button from '@/shared/ui/Button'
import { useParallax } from '@/shared/hooks/useParallax'
import Misted from '@/shared/ui/Misted'
import styles from './NotFound.module.scss'

const NotFound = ({ user = false }: { user?: boolean }) => {
  const { bgRef, topRef } = useParallax({
    topCoefficient: 4,
    bgCoefficient: 2
  })

  return (
    <div className={styles.notFound}>
      <div ref={bgRef}>
        <Misted className={styles.notFound__logo}>
          <Logo />
        </Misted>
      </div>
      <div
        ref={topRef}
        className={styles.notFound__body}
      >
        <div className={styles.notFound__content}>
          <h1 className={styles.notFound__title}>404</h1>
          <p className={styles.notFound__description}>
            {user ? 'USER_NOT_FOUND' : 'PAGE_NOT_FOUND'}
          </p>
        </div>
        <Button
          color='solid'
          navigate='back'
        >
          {'<-'} назад
        </Button>
      </div>
    </div>
  )
}

export default NotFound
