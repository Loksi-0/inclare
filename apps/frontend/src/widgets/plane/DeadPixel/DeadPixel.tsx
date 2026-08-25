'use client'

import styles from './DeadPixel.module.scss'
import Button from '@/components/Button'
import { UI } from '@/constants'
import { postStore } from '@/stores/post.store'
import { useDeadPixel } from './useDeadPixel'

const DeadPixel = () => {
  const { postId, pixelRef } = useDeadPixel()

  return (
    <div
      className={styles.pixel}
      ref={pixelRef}
    >
      {postId && (
        <Button
          className={styles.pixel__button}
          color='none'
          style={{
            width: UI.PLANE_GRID_SCALE,
            height: UI.PLANE_GRID_SCALE
          }}
          onClick={() => {
            postStore.open(postId)
          }}
        ></Button>
      )}
    </div>
  )
}

export default DeadPixel
