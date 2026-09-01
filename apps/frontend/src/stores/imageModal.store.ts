import { makeAutoObservable } from 'mobx'

class ImageModalStore {
  isOpen = false
  isClosing = false
  src: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  open = (src: string) => {
    this.isOpen = true
    this.src = src
  }

  close = () => {
    this.isOpen = false
    this.isClosing = true

    requestAnimationFrame(() => {
      this.setIsClosing(false)
    })
  }

  setIsClosing = (bool: boolean) => {
    this.isClosing = bool
  }
}

export const imageModalStore = new ImageModalStore()
