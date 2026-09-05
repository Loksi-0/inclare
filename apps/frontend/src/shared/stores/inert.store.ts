import { makeAutoObservable } from 'mobx'

class InertStore {
  isInert = false

  constructor() {
    makeAutoObservable(this)
  }

  setInert = (bool: boolean) => {
    this.isInert = bool
  }

  getInert = () => {
    return this.isInert
  }
}

export const inertStore = new InertStore()
