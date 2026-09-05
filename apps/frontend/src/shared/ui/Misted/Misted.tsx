'use client'

import { useId, type PropsWithChildren } from 'react'
import { useMisted } from './useMisted'
import styles from './Misted.module.scss'

type MistedProps = PropsWithChildren<{
  size?: number
  delay?: number
  blur?: number
  className?: string
}>

const Misted = (props: MistedProps) => {
  const { children, className, size = 20, delay = 3, blur = 5 } = props

  const maskId = useId()
  const blurId = useId()
  const { groupRef, maskRef } = useMisted({ size, delay })

  return (
    <div className={styles.misted}>
      <svg
        ref={maskRef}
        className={styles.misted__mask}
      >
        <defs>
          <mask id={maskId}>
            <filter id={blurId}>
              <feGaussianBlur stdDeviation='5' />
            </filter>
            <rect
              fill='white'
              className={styles.misted__rect}
            />
            <g
              ref={groupRef}
              filter={`url(#${blurId})`}
            ></g>
          </mask>
        </defs>
      </svg>
      <div
        className={styles.misted__backdrop}
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: `url(#${maskId})`
        }}
      ></div>
      <div className={className}>{children}</div>
    </div>
  )
}

export default Misted
