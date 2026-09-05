import { makeAutoObservable } from 'mobx'

class PostStore {
  postId: string | null = null
  postHeight: number | null = null
  prevPostHeight = 0
  isOpen = false
  isFullyOpen = false
  canCloseOutside = true
  isRenderReady = false
  isOpening = false
  isAnimating = false
  scrollPosition = 0
  offsetHeight = 0

  constructor() {
    makeAutoObservable(this)
  }

  private shiftPost = (offset?: number | null) => {
    if (this.isAnimating) {
      return
    }

    const maxHeight = window.innerHeight * 0.7
    const minHeight = window.innerHeight * 0.4

    const offsetHeight = offset
      ? Math.max(Math.min(window.innerHeight - offset, maxHeight), minHeight)
      : maxHeight

    this.offsetHeight = offsetHeight
    this.postHeight = offsetHeight
    this.prevPostHeight = offsetHeight
  }

  open = (id: string, offset?: number | null) => {
    if (this.isAnimating) {
      return
    }

    if (!this.isOpen) {
      this.shiftPost(offset)
    }

    this.isOpen = true
    this.scrollPosition = 0
    this.postId = id
  }

  openFull = () => {
    if (this.isAnimating) {
      return
    }

    this.postHeight = window.innerHeight
    this.offsetHeight = window.innerHeight
    this.isFullyOpen = true
  }

  closeFull = () => {
    if (this.isAnimating) {
      return
    }

    this.isFullyOpen = false
  }

  close = () => {
    if (this.isAnimating) {
      return
    }

    this.isOpen = false
    this.isFullyOpen = false
    this.offsetHeight = 0
  }

  closeInstantly = () => {
    this.isOpen = false
    this.offsetHeight = 0
    this.setIsRenderReady(false)
    this.setPostId(null)
    // gsap.set(this.bodyRef, { y: '0' })
  }

  setPostId = (id: string | null) => {
    this.postId = id
  }

  setPostHeight = (height: number) => {
    this.postHeight = height
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

  setIsFullyOpen = (bool: boolean) => {
    this.isFullyOpen = bool
  }
}

export const postStore = new PostStore()
