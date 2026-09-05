import { makeAutoObservable } from 'mobx'

class EffectorStore {
  effectorRef: HTMLDivElement | null = null

  constructor() {
    makeAutoObservable(this)
  }
}

export const effectorStore = new EffectorStore()
