'use client'

import cx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useCursor } from './useCursor'
import { preferencesStore } from '@/shared/stores/preferences.store'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import styles from './Cursor.module.scss'

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
