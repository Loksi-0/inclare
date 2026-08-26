'use client'

import { useEffect, useRef, type PropsWithChildren } from 'react'
import { effectorStore } from '@/stores/effector.store'
import { postStore } from '@/stores/post.store'
import { inertStore } from '@/stores/inert.store'
import { observer } from 'mobx-react-lite'
import styles from './Effector.module.scss'

const Effector = observer(({ children }: PropsWithChildren) => {
  const effectorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    postStore.bodyRef = effectorRef.current
    effectorStore.effectorRef = effectorRef.current

    effectorStore.init()
  }, [])

  return (
    <div
      ref={effectorRef}
      className={styles.effector}
      inert={inertStore.isInert}
    >
      {children}
    </div>
  )
})

export default Effector
