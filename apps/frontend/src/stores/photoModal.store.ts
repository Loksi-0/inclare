import { isClient } from '@/shared/functions/isClient'
import { closeModal, openModal } from '@/shared/functions/manageModal'
import { makeAutoObservable } from 'mobx'

type PhotoData = {
  id: string
  order: number
  optimizedUrl: string
  rawUrl: string
  shutterSpeed: string | null
  iso: number | null
  aperture: number | null
  focalLength: string | null
  cameraModel: string | null
}

type OpenOpts = {
  photos: PhotoData[]
  current: number
}

class PhotoModalStore {
  photos: PhotoData[] = []
  current = 0
  isOpen = false
  isClosing = false

  constructor() {
    makeAutoObservable(this)

    if (!isClient) {
      return
    }

    document.addEventListener('keyup', (e) => {
      if (!this.isOpen || this.isClosing) {
        return
      }

      if (e.key === 'ArrowLeft') {
        this.prevCurrent()
      } else if (e.key === 'ArrowRight') {
        this.nextCurrent()
      }
    })
  }

  open = ({ photos, current }: OpenOpts) => {
    this.isOpen = true
    this.photos = photos
    this.current = current
    openModal()
  }

  close = () => {
    this.isOpen = false
    this.isClosing = true
    closeModal()

    requestAnimationFrame(() => {
      this.setIsClosing(false)
    })
  }

  nextCurrent = () => {
    const prevIndex = this.photos.findIndex((p) => p.order === this.current)
    const nextIndex = prevIndex !== -1 && prevIndex + 1

    if (!nextIndex || nextIndex > this.photos.length - 1) {
      return
    }

    const nextOrder = nextIndex && this.photos.at(nextIndex)?.order

    if (typeof nextOrder !== 'number') {
      return
    }

    this.current = nextOrder
  }

  prevCurrent = () => {
    const prevIndex = this.photos.findIndex((p) => p.order === this.current)
    const nextIndex = prevIndex !== -1 && prevIndex - 1

    if (typeof nextIndex !== 'number' || nextIndex < 0) {
      return
    }

    const nextOrder = nextIndex && this.photos.at(nextIndex)?.order

    if (typeof nextOrder !== 'number') {
      return
    }

    this.current = nextOrder
  }

  setIsClosing = (bool: boolean) => {
    this.isClosing = bool
  }
}

export const photoModalStore = new PhotoModalStore()
