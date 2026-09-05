'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { photoModalStore } from './photoModal.store'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { useAppearMotion } from '@/shared/hooks/useAppear.motion'

export const usePhotoModal = () => {
  const [isImgLoaded, setIsImgLoaded] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useAppearMotion({ ref: modalRef, state: photoModalStore.isOpen })

  const data = useMemo(() => {
    return photoModalStore.photos.find(
      (p) => p.order === photoModalStore.current
    )
  }, [photoModalStore.photos, photoModalStore.current])

  useSwipe({
    strength: 'medium',
    onVertical: () => {
      if (!photoModalStore.isOpen) {
        return
      }

      photoModalStore.close()
    }
  })

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (!photoModalStore.isOpen || photoModalStore.isClosing) {
        return
      }

      if (e.key === 'ArrowLeft') {
        photoModalStore.prevCurrent()
      } else if (e.key === 'ArrowRight') {
        photoModalStore.nextCurrent()
      }
    }

    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keyup', onKeyUp)
    }
  })

  useEffect(() => {
    setIsImgLoaded(false)
    gsap.to(imgRef.current, { opacity: 0, duration: 0.2 })
  }, [data?.optimizedUrl])

  const { minOrder, maxOrder } = useMemo(() => {
    if (!photoModalStore.photos.at(0)) {
      return {
        minOrder: 0,
        maxOrder: 0
      }
    }

    const minPhoto = photoModalStore.photos.reduce((prev, current) =>
      prev.order < current.order ? prev : current
    )
    const maxPhoto = photoModalStore.photos.reduce((prev, current) =>
      prev.order > current.order ? prev : current
    )

    return {
      minOrder: minPhoto.order,
      maxOrder: maxPhoto.order
    }
  }, [photoModalStore.photos])

  const { rawExt, optimizedExt } = useMemo(() => {
    if (!data) {
      return { rawExt: undefined, optimizedExt: undefined }
    }

    const rawExt = data.rawUrl.split('.').at(-1)
    const optimizedExt = data.optimizedUrl.split('.').at(-1)

    return { rawExt, optimizedExt }
  }, [data])

  return {
    data,
    imgRef,
    modalRef,
    isImgLoaded,
    setIsImgLoaded,
    minOrder,
    maxOrder,
    rawExt,
    optimizedExt
  }
}
