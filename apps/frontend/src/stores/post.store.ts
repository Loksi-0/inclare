import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class PostStore {
  postId: string | null = null
  postHeight: number | null = null
  prevPostHeight = 0
  isOpen = false
  isFullyOpen = false
  isUploading = false
  bodyRef: HTMLElement | null = null
  canCloseOutside = true
  isRenderReady = false
  isOpening = false
  isAnimating = false
  scrollPosition = 0

  constructor() {
    makeAutoObservable(this)
  }

  private shiftPost = (offset?: number) => {
    if (!this.bodyRef || this.isAnimating) {
      return
    }

    const maxHeight = window.innerHeight * 0.7
    const minHeight = window.innerHeight * 0.4

    const offsetHeight = offset
      ? Math.max(Math.min(window.innerHeight - offset, maxHeight), minHeight)
      : maxHeight

    this.postHeight = offsetHeight
    this.prevPostHeight = offsetHeight

    gsap.to(this.bodyRef, {
      y: offsetHeight * -1,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        this.setIsRenderReady(false)
        this.setIsOpening(true)
        this.setIsAnimating(true)
      },
      onComplete: () => {
        this.setIsRenderReady(true)
        this.setIsOpening(false)
        this.setIsAnimating(false)
      }
    })
  }

  open = (id: string, offset?: number) => {
    if (this.isAnimating) {
      return
    }

    this.isOpen = true
    this.postId = id
    this.setIsUploading(false)
    this.shiftPost(offset)
  }

  openFull = () => {
    if (!this.bodyRef || this.isAnimating) {
      return
    }

    this.postHeight = window.innerHeight
    this.isFullyOpen = true
    this.isAnimating = true

    gsap.to(this.bodyRef, {
      y: window.innerHeight * -1,
      duration: 0.6,
      ease: 'power2.out',
      onStart: () => {
        this.setIsAnimating(true)
      },
      onComplete: () => {
        this.setIsAnimating(false)
        this.setPostHeight(window.innerHeight)
      }
    })
  }

  openUpload = (offset?: number) => {
    if (this.isAnimating) {
      return
    }

    this.isOpen = true
    this.setIsUploading(true)
    this.shiftPost(offset)
  }

  closeFull = () => {
    if (!this.bodyRef || this.isAnimating) {
      return
    }

    this.isFullyOpen = false

    gsap.to(this.bodyRef, {
      y: this.prevPostHeight * -1,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        this.setIsAnimating(true)
      },
      onComplete: () => {
        this.setIsAnimating(false)
        this.setPostHeight(this.prevPostHeight)
      }
    })
  }

  close = (onClose?: () => void) => {
    if (!this.bodyRef || this.isAnimating) {
      return
    }

    this.isOpen = false
    this.isFullyOpen = false

    gsap.to(this.bodyRef, {
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        this.setIsAnimating(true)
      },
      onComplete: () => {
        this.setIsUploading(false)
        this.setIsRenderReady(false)
        this.setIsAnimating(false)
        onClose?.()

        if (!this.isOpening) {
          this.setPostId(null)
        }
      }
    })
  }

  closeInstantly = () => {
    if (!this.bodyRef) {
      return
    }

    this.isOpen = false
    this.isUploading = false
    this.setIsRenderReady(false)
    this.setPostId(null)
    gsap.set(this.bodyRef, { y: '0' })
  }

  setPostId = (id: string | null) => {
    this.postId = id
  }

  setPostHeight = (height: number) => {
    this.postHeight = height
  }

  setIsUploading = (bool: boolean) => {
    this.isUploading = bool
  }

  setIsAnimating = (bool: boolean) => {
    this.isAnimating = bool
  }

  setCanClose = (bool: boolean) => {
    this.canCloseOutside = bool
  }

  setIsRenderReady = (bool: boolean) => {
    this.isRenderReady = bool
  }

  setIsOpening = (bool: boolean) => {
    this.isOpening = bool
  }

  setScrollPosition = (pos: number) => {
    this.scrollPosition = pos
  }
}

export const postStore = new PostStore()
