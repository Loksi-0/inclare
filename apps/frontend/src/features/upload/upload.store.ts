import { makeAutoObservable } from 'mobx'
import { timelineStore } from '../timeline'

class UploadStore {
  isOpen = false
  isAnimating = false
  offset = 0
  height = 0

  totalPhotos = 0
  settledPhotos = 0
  errorPhotos = 0

  onAnimationEnd = () => {}

  constructor() {
    makeAutoObservable(this)
  }

  private calcOffset = () => {
    const maxHeight = window.innerHeight * 0.7
    const minHeight = window.innerHeight * 0.4

    const timelineOffset = timelineStore.getOffset()
    const offsetHeight = timelineOffset
      ? Math.max(
          Math.min(window.innerHeight - timelineOffset, maxHeight),
          minHeight
        )
      : maxHeight

    this.offset = offsetHeight * -1
    this.height = offsetHeight
  }

  open = () => {
    if (this.isAnimating) {
      return
    }

    this.isOpen = true
    this.calcOffset()
  }

  close = (onEnd?: () => void) => {
    if (this.isAnimating) {
      return
    }

    this.isOpen = false

    if (onEnd) {
      this.onAnimationEnd = onEnd
    }
  }

  setTotal = (amount: number) => {
    this.totalPhotos = amount
  }

  incrementSettled = () => {
    this.settledPhotos++
  }

  decrementSettled = () => {
    if (this.settledPhotos < 1) {
      this.settledPhotos = 0
      return
    }

    this.settledPhotos--
  }

  incrementError = () => {
    this.errorPhotos++
  }

  decrementError = () => {
    if (this.errorPhotos < 1) {
      this.errorPhotos = 0
      return
    }

    this.errorPhotos--
  }

  reset = () => {
    this.totalPhotos = 0
    this.settledPhotos = 0
    this.errorPhotos = 0
  }

  setIsAnimating = (bool: boolean) => {
    this.isAnimating = bool
  }
}

export const uploadStore = new UploadStore()
