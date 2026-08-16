import { closeModal, openModal } from '@/shared/functions/manageModal'
import { makeAutoObservable, observable } from 'mobx'

type PhotoData = {
  order: number
  optimizedUrl: string
  shutterSpeed: string | null
  iso: number | null
  aperture: number | null
  focalLength: string | null
  cameraModel: string | null
}

class PhotoModalStore {
  photos: PhotoData[] = []
  current = 0
  isOpen = false

  constructor() {
    makeAutoObservable(this)
  }

  open = (photos: PhotoData[], current: number) => {
    this.isOpen = true
    this.photos = photos
    this.current = current
    openModal()
  }

  close = () => {
    this.isOpen = false
    closeModal()
  }

  nextCurrent = () => {
    const prevIndex = this.photos.findIndex((p) => p.order === this.current)
    const nextOrder = prevIndex !== -1 && this.photos.at(prevIndex + 1)?.order

    if (typeof nextOrder !== 'number') {
      return
    }

    this.current = nextOrder
  }

  prevCurrent = () => {
    const prevIndex = this.photos.findIndex((p) => p.order === this.current)
    const nextOrder = prevIndex !== -1 && this.photos.at(prevIndex - 1)?.order

    if (typeof nextOrder !== 'number') {
      return
    }

    this.current = nextOrder
  }
}

export const photoModalStore = new PhotoModalStore()
