'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { postStore } from './post.store'
import { effectorStore } from '../effector'

export const usePostMotion = () => {
  useEffect(() => {
    if (postStore.isOpen) {
      gsap.to(effectorStore.effectorRef, {
        y: postStore.offsetHeight * -1,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          postStore.setIsRenderReady(false)
          postStore.setIsOpening(true)
          postStore.setIsAnimating(true)
        },
        onComplete: () => {
          postStore.setIsRenderReady(true)
          postStore.setIsOpening(false)
          postStore.setIsAnimating(false)
        }
      })
    } else {
      gsap.to(effectorStore.effectorRef, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          postStore.setIsAnimating(true)
        },
        onComplete: () => {
          postStore.setIsRenderReady(false)
          postStore.setIsAnimating(false)

          if (!postStore.isOpening) {
            postStore.setPostId(null)
          }
        }
      })
    }
  }, [postStore.isOpen])

  useEffect(() => {
    if (postStore.isFullyOpen) {
      gsap.to(effectorStore.effectorRef, {
        y: window.innerHeight * -1,
        duration: 0.6,
        ease: 'power2.out',
        onStart: () => {
          postStore.setIsAnimating(true)
        },
        onComplete: () => {
          postStore.setIsAnimating(false)
          postStore.setPostHeight(window.innerHeight)
          postStore.setIsFullyOpen(true)
        }
      })
    } else {
      gsap.to(effectorStore.effectorRef, {
        y: postStore.prevPostHeight * -1,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          postStore.setIsAnimating(true)
        },
        onComplete: () => {
          postStore.setIsAnimating(false)
          postStore.setPostHeight(postStore.prevPostHeight)
          postStore.setIsFullyOpen(false)
        }
      })
    }
  }, [postStore.isFullyOpen])
}
