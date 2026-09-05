import { makeAutoObservable } from 'mobx'
import { timelineStore } from '../timeline'

type OpenOpts = {
  id: string
  timeline?: boolean
}

class PostStore {
  postId: string | null = null

  isOpenSignal = false
  isUploadingSignal = false
  isFullyOpenSignal = false
  isCloseInstantlySignal = false

  isOpen = false
  isUploading = false
  isFullyOpen = false
  isAnimating = false
  isOpening = false
  isRenderReady = false
  canCloseOutside = true

  shift = 0
  height = 0
  minHeight = 0
  scrollPos = 0

  onAnimationEnd = () => {}

  constructor() {
    makeAutoObservable(this)
  }

  private calcShift = (isOffset?: boolean) => {
    const maxHeight = window.innerHeight * 0.7
    const minHeight = window.innerHeight * 0.4

    const timelineOffset = isOffset ? timelineStore.getOffset() : undefined
    const offsetHeight = timelineOffset
      ? Math.max(
          Math.min(window.innerHeight - timelineOffset, maxHeight),
          minHeight
        )
      : maxHeight

    this.shift = offsetHeight * -1
    this.height = offsetHeight
    this.minHeight = offsetHeight
  }

  open = ({ id, timeline }: OpenOpts) => {
    if (!this.isOpenSignal) {
      if (!this.isAnimating) {
        this.isAnimating = true
      }

      this.calcShift(timeline)
    }

    this.isOpen = true
    this.isOpenSignal = true
    this.isUploading = false
    this.isUploadingSignal = false
    this.postId = id
    this.isOpening = true
  }

  onOpenEnd = () => {
    this.isAnimating = false
    this.isRenderReady = true
    this.isOpening = false
  }

  openFull = () => {
    if (!this.isFullyOpenSignal) {
      this.isFullyOpenSignal = true
      this.isAnimating = true
    }

    this.isFullyOpen = true
    this.height = window.innerHeight
    this.shift = window.innerHeight * -1
  }

  onOpenFullEnd = () => {
    this.isAnimating = false
  }

  closeFull = () => {
    this.isFullyOpenSignal = false
    this.isAnimating = true
    this.shift = this.minHeight * -1
  }

  onCloseFullEnd = () => {
    this.isAnimating = false
    this.isFullyOpen = false
    this.height = this.minHeight
  }

  close = (onEnd?: () => void) => {
    if (this.isAnimating) {
      return
    }

    this.isAnimating = true
    this.isOpenSignal = false
    this.isUploadingSignal = false

    if (onEnd) {
      this.onAnimationEnd = onEnd
    }
  }

  onCloseEnd = () => {
    this.isAnimating = false
    this.isOpen = false
    this.isUploading = false
    this.isRenderReady = false
    this.onAnimationEnd()
    this.onAnimationEnd = () => {}

    if (!this.isOpening) {
      this.setPostId(null)
    }
  }

  closeInstantly = () => {
    this.isCloseInstantlySignal = true
    this.isOpen = false
    this.isOpenSignal = false

    requestAnimationFrame(() => {
      this.setIsInstant(false)
    })
  }

  openUpload = () => {
    if (!this.isOpenSignal) {
      if (!this.isAnimating) {
        this.isAnimating = true
      }

      this.calcShift(true)
    }

    this.isUploadingSignal = true
    this.isUploading = true
    this.isOpenSignal = true
    this.isOpen = true
  }

  setPostId = (id: string | null) => {
    this.postId = id
  }

  setIsAnimating = (bool: boolean) => {
    this.isAnimating = bool
  }

  setIsOpen = (bool: boolean) => {
    this.isOpen = bool
  }

  setIsInstant = (bool: boolean) => {
    this.isCloseInstantlySignal = bool
  }

  setIsRenderReady = (bool: boolean) => {
    this.isRenderReady = bool
  }

  setCanCloseOutside = (bool: boolean) => {
    this.canCloseOutside = bool
  }

  setScrollPos = (pos: number) => {
    this.scrollPos = pos
  }
}

export const postStore = new PostStore()
