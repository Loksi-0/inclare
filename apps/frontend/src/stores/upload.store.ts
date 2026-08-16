import { makeAutoObservable } from 'mobx'

class UploadStore {
  totalPhotos = 0
  settledPhotos = 0
  errorPhotos = 0

  constructor() {
    makeAutoObservable(this)
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
}

export const uploadStore = new UploadStore()
