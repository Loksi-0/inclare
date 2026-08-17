'use client'

import Preloader from '../Preloader'
import styles from './ProgressBar.module.scss'
import cx from 'clsx'
import { useProgressBar } from './useProgressBar'

const ProgressBar = ({ percentage }: { percentage: number }) => {
  const { containerRef, measureRef, dots } = useProgressBar(percentage)

  return (
    <div className={cx(styles.progress, 'mono', 'subtitle')}>
      {percentage !== 100 && <Preloader />}
      <p>{percentage}%</p>
      <div
        className={styles.progress__bar}
        ref={containerRef}
      >
        <div
          ref={measureRef}
          className={styles.progress__measure}
        >
          .
        </div>
        <div>
          <span>[</span>
          <span>{dots}</span>
        </div>
        <span>]</span>
      </div>
    </div>
  )
}

export default ProgressBar
