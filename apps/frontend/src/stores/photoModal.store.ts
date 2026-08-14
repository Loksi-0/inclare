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
  current: number | null = null
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
    if (typeof this.current !== 'number') {
      return
    }

    this.current++
  }

  prevCurrent = () => {
    if (typeof this.current !== 'number') {
      return
    }

    this.current--
  }
}

export const photoModalStore = new PhotoModalStore()
