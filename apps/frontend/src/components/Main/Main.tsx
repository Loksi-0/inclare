'use client'

import { mainStore } from '@/stores/main.store'
import { useEffect, useRef, type PropsWithChildren } from 'react'
import styles from './Main.module.scss'

const Main = ({ children }: PropsWithChildren) => {
  const mainRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mainRef.current) {
      return
    }

    mainStore.setMainRef(mainRef.current)
  }, [])

  return (
    <div
      className={styles.main}
      ref={mainRef}
    >
      {children}
    </div>
  )
}

export default Main
