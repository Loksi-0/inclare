'use client'

import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import Image from '@/shared/ui/Image'
import { imageModalStore } from './imageModal.store'
import { useSwipe } from '@/shared/hooks/useSwipe'
import styles from './ImageModal.module.scss'
import { useAppearMotion } from '@/shared/hooks/useAppear.motion'

const ImageModal = observer(() => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useAppearMotion({ ref: modalRef, state: imageModalStore.isOpen })

  useSwipe({
    strength: 'medium',
    onVertical: () => {
      if (!imageModalStore.isOpen) {
        return
      }

      imageModalStore.close()
    }
  })

  return (
    <div
      ref={modalRef}
      className={styles.modal}
      onClick={() => {
        imageModalStore.close()
      }}
    >
      {imageModalStore.src && (
        <Image
          className={styles.modal__image}
          src={imageModalStore.src}
          width={1000}
          height={1000}
        />
      )}
    </div>
  )
})

export default ImageModal
