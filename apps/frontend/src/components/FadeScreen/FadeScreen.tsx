'use client'

import { observer } from 'mobx-react-lite'
import cx from 'clsx'
import styles from './FadeScreen.module.scss'
import { fadeScreenStore } from '@/stores/fadeScreen.store'
import { useEffect, useRef } from 'react'

const FadeScreen = observer(() => {
  const screenRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!screenRef.current) {
      return
    }

    fadeScreenStore.screenElement = screenRef.current
    fadeScreenStore.close()
  }, [])

  return (
    <div
      ref={screenRef}
      className={cx(styles.screen)}
    ></div>
  )
})

export default FadeScreen
