'use client'

import { useCursor } from './useCursor'
import styles from './Cursor.module.scss'
import { observer } from 'mobx-react-lite'
import cx from 'clsx'
import { preferencesStore } from '@/stores/preferences.store'
import { useIsMounted } from '@/shared/hooks/useIsMounted'

const Cursor = observer(() => {
  const { isMounted } = useIsMounted()
  const { cursorRef } = useCursor()

  return (
    <div
      ref={cursorRef}
      className={cx(styles.cursor, [
        { [styles.hidden]: !preferencesStore.showCursor && isMounted }
      ])}
    ></div>
  )
})

export default Cursor
