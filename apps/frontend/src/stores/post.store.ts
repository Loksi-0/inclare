import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class PostStore {
  postId: string | null = null
  postHeight: number | null = null
  isOpen = false
  isUploading = false
  bodyRef: HTMLElement | null = null
  canCloseOutside = true
  isRenderReady = false
  isOpening = false

  constructor() {
    makeAutoObservable(this)
  }

  private shiftPost = (offset?: number) => {
    if (!this.bodyRef) {
      return
    }

    const maxHeight = window.innerHeight * 0.7
    const minHeight = window.innerHeight * 0.4

    const offsetHeight = offset
      ? Math.max(Math.min(window.innerHeight - offset, maxHeight), minHeight)
      : maxHeight

    this.postHeight = offsetHeight

    gsap.to(this.bodyRef, {
      y: offsetHeight * -1,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {
        this.setIsRenderReady(false)
        this.setIsOpening(true)
      },
      onComplete: () => {
        this.setIsRenderReady(true)
        this.setIsOpening(false)
      }
    })
  }

  open = (id: string, offset?: number) => {
    if (!this.bodyRef) {
      return
    }

    this.isOpen = true
    this.postId = id
    this.setIsUploading(false)
    this.shiftPost(offset)
  }

  openUpload = (offset?: number) => {
    this.isOpen = true
    this.setIsUploading(true)
    this.shiftPost(offset)
  }

  close = (onClose?: () => void) => {
    if (!this.bodyRef) {
      return
    }

    this.isOpen = false

    gsap.to(this.bodyRef, {
      y: '0',
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        this.setIsUploading(false)
        this.setIsRenderReady(false)
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

  setIsUploading = (bool: boolean) => {
    this.isUploading = bool
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
}

export const postStore = new PostStore()
