import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class PostStore {
  postId: string | null = null
  postHeight: number | null = null
  isOpen = false
  isUploading = false
  bodyRef: HTMLElement | null = null

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
      ease: 'power2.out'
    })
  }

  setPostId = (id: string | null) => {
    this.postId = id
  }

  open = (id: string, offset?: number) => {
    if (!this.bodyRef) {
      return
    }

    this.postId = id
    this.isOpen = true
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
        this.setPostId(null)
        this.setIsUploading(false)
        onClose?.()
      }
    })
  }

  setIsUploading = (bool: boolean) => {
    this.isUploading = bool
  }
}

export const postStore = new PostStore()
