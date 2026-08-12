'use client'

import styles from './Cursor.module.scss'
import { useCursor } from './useCursor'

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
