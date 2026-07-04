'use client'

import { type PropsWithChildren } from 'react'
import styles from './Misted.module.scss'
import { useMisted } from './useMisted'

type MistedProps = PropsWithChildren<{
  size?: number
  delay?: number
  blur?: number
  className?: string
}>

const Misted = (props: MistedProps) => {
  const { children, className, size = 20, delay = 3, blur = 5 } = props

  const { groupRef, maskRef } = useMisted({ size, delay })

  return (
    <div className={styles.misted}>
      <svg
        ref={maskRef}
        className={styles.misted__mask}
      >
        <defs>
          <mask id='misted-mask'>
            <filter id='misted-blur'>
              <feGaussianBlur stdDeviation='5' />
            </filter>
            <rect
              fill='white'
              className={styles.misted__rect}
            />
            <g
              ref={groupRef}
              filter='url(#misted-blur)'
            ></g>
          </mask>
        </defs>
      </svg>
      <div
        className={styles.misted__backdrop}
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`
        }}
      ></div>
      <div className={className}>{children}</div>
    </div>
  )
}

export default Misted
