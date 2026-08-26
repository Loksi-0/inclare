'use client'

import Button from '@/components/Button'
import { UI } from '@/constants'
import { postStore } from '@/stores/post.store'
import { useDeadPixel } from './useDeadPixel'
import { onboardingStore } from '@/stores/onboarding.store'
import styles from './DeadPixel.module.scss'

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
            onboardingStore.openPixel()
          }}
        ></Button>
      )}
    </div>
  )
}

export default DeadPixel
