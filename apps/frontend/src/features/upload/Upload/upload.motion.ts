'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { uploadStore } from '../upload.store'
import { effectorStore } from '@/features/effector'

export const useUploadMotion = () => {
  useEffect(() => {
    if (uploadStore.isOpen) {
      gsap.to(effectorStore.effectorRef, {
        y: uploadStore.offset,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          uploadStore.setIsAnimating(true)
        },
        onComplete: () => {
          uploadStore.setIsAnimating(false)
        }
      })
    } else {
      gsap.to(effectorStore.effectorRef, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          uploadStore.setIsAnimating(true)
        },
        onComplete: () => {
          uploadStore.setIsAnimating(false)
          uploadStore?.onAnimationEnd()
        }
      })
    }
  }, [uploadStore.isOpen])
}
