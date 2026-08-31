import { makeAutoObservable } from 'mobx'

class ImageModalStore {
  isOpen = false
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
  }
}

export const imageModalStore = new ImageModalStore()
