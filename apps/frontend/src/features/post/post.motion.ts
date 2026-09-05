import { effectorStore } from '../effector'
import { postStore } from './post.store'
import { useEffect } from 'react'
import gsap from 'gsap'

export const usePostMotion = () => {
  useEffect(() => {
    if (postStore.isOpenSignal) {
      gsap.to(effectorStore.effectorRef, {
        y: postStore.shift,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: postStore.onOpenEnd
      })
    } else {
      gsap.to(effectorStore.effectorRef, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: postStore.onCloseEnd
      })
    }
  }, [postStore.isOpenSignal])

  useEffect(() => {
    if (postStore.isCloseInstantlySignal) {
      gsap.set(effectorStore.effectorRef, { y: 0 })
    }
  }, [postStore.isCloseInstantlySignal])

  useEffect(() => {
    if (postStore.isFullyOpenSignal) {
      gsap.to(effectorStore.effectorRef, {
        y: postStore.shift,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: postStore.onOpenFullEnd
      })
    } else {
      gsap.to(effectorStore.effectorRef, {
        y: postStore.shift,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: postStore.onCloseFullEnd
      })
    }
  }, [postStore.isFullyOpenSignal])
}
