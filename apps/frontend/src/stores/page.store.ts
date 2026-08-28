import { makeAutoObservable } from 'mobx'

class PageStore {
  pageRef: HTMLDivElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setPageRef = (ref: HTMLDivElement) => {
    this.pageRef = ref
  }
}

export const pageStore = new PageStore()
