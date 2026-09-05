'use client'

import { useEffect, useRef, type PropsWithChildren } from 'react'
import { effectorStore } from './effector.store'
import { inertStore } from '@/shared/stores/inert.store'
import { observer } from 'mobx-react-lite'
import styles from './Effector.module.scss'
import gsap from 'gsap'

const Effector = observer(({ children }: PropsWithChildren) => {
  const effectorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    effectorStore.effectorRef = effectorRef.current

    gsap.to(effectorRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    })
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
