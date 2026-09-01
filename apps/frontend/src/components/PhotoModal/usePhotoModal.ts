'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { photoModalStore } from '@/stores/photoModal.store'
import { useBlur } from '@/shared/hooks/useBlur'
import gsap from 'gsap'
import { useSwipe } from '@/shared/hooks/useSwipe'

export const usePhotoModal = () => {
  const [isImgLoaded, setIsImgLoaded] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const blurIn = useBlur({ from: 0, to: 10 })
  const blurOut = useBlur({ from: 10, to: 0 })

  const data = useMemo(() => {
    return photoModalStore.photos.find(
      (p) => p.order === photoModalStore.current
    )
  }, [photoModalStore.photos, photoModalStore.current])

  useSwipe({
    strength: 'medium',
    onVertical: () => {
      if (photoModalStore.isOpen) {
        photoModalStore.close()
      }
    }
  })

  useEffect(() => {
    if (photoModalStore.isOpen) {
      blurOut(modalRef.current)
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          display: 'flex'
        },
        {
          opacity: 1,
          duration: 0.2
        }
      )
    } else {
      blurIn(modalRef.current)
      gsap.fromTo(
        modalRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          display: 'none',
          duration: 0.2,
          onComplete: () => {
            photoModalStore.setIsClosing(false)
          }
        }
      )
    }
  }, [photoModalStore.isOpen])

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
