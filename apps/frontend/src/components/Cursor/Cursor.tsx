'use client'

import { useCursor } from './useCursor'
import styles from './Cursor.module.scss'

const Cursor = () => {
  const { cursorRef } = useCursor()

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
    ></div>
  )
}

export default Cursor
