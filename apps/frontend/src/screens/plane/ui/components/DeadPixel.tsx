'use client'

import Button from '@/shared/ui/Button'
import { UI } from '@/constants'
import { postStore } from '@/features/post/post.store'
import { useDeadPixel } from '../../model/useDeadPixel'
import { onboardingStore } from '@/features/onboarding/onboarding.store'
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
