import { closeModal, openModal } from '@/shared/functions/manageModal'
import { makeAutoObservable } from 'mobx'

type PhotoData = {
  order: number
  optimizedUrl: string
  shutterSpeed: string | null
  iso: number | null
  aperture: number | null
  focalLength: string | null
  cameraModel: string | null
}

type OpenOpts = {
  photos: PhotoData[]
  current: number
  isUnoptimized?: boolean
}

class PhotoModalStore {
  photos: PhotoData[] = []
  current = 0
  isOpen = false
  isUnoptimized = false

  constructor() {
    makeAutoObservable(this)
  }

  open = ({ photos, current, isUnoptimized }: OpenOpts) => {
    this.isOpen = true
    this.photos = photos
    this.current = current
    this.isUnoptimized = isUnoptimized ?? false
    openModal()
  }

  close = () => {
    this.isOpen = false
    this.isUnoptimized = false
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
