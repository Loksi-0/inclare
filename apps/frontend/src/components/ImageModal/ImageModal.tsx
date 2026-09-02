'use client'

import { observer } from 'mobx-react-lite'
import Image from '../Image'
import { imageModalStore } from '@/stores/imageModal.store'
import styles from './ImageModal.module.scss'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useBlur } from '@/shared/hooks/useBlur'
import { useSwipe } from '@/shared/hooks/useSwipe'

const ImageModal = observer(() => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const blurOut = useBlur({ from: 10, to: 0 })
  const blurIn = useBlur({ from: 0, to: 10 })

  useSwipe({
    strength: 'medium',
    onVertical: () => {
      if (!imageModalStore.isOpen) {
        return
      }

      imageModalStore.close()
    }
  })

  useEffect(() => {
    if (imageModalStore.isOpen) {
      blurOut(modalRef.current)
      gsap.set(modalRef.current, { display: 'flex' })
      gsap.to(modalRef.current, {
        opacity: 1,
        duration: 0.2
      })
    } else {
      blurIn(modalRef.current)
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.2,
        display: 'none'
      })
    }
  }, [imageModalStore.isOpen])

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
