'use client'

import { useEffect, useRef, type PropsWithChildren } from 'react'
import styles from './Effector.module.scss'
import { effectorStore } from '@/stores/effector.store'
import { postStore } from '@/stores/post.store'

const Effector = ({ children }: PropsWithChildren) => {
  const effectorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    postStore.bodyRef = effectorRef.current
    effectorStore.effectorRef = effectorRef.current

    effectorStore.zoom(1)
  }, [])

  return (
    <div
      ref={effectorRef}
      className={styles.effector}
    >
      {children}
    </div>
  )
}

export default Effector
