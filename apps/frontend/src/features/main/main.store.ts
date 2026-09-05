import { makeAutoObservable } from 'mobx'

class MainStore {
  mainRef: HTMLDivElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setMainRef = (ref: HTMLDivElement) => {
    this.mainRef = ref
  }
}

export const mainStore = new MainStore()
