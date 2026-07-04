'use client'

import Logo from '@/icons/Logo'
import Button from '@/components/Button'
import styles from './NotFound.module.scss'
import { useParallax } from '@/shared/hooks/useParallax'
import Misted from '@/components/Misted'

const NotFound = () => {
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
          <p className={styles.notFound__description}>PAGE_NOT_FOUND</p>
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
