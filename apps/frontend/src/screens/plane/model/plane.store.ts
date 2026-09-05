import { makeAutoObservable } from 'mobx'

class PlaneStore {
  currentChunkX = 0
  currentChunkY = 0
  scale = 1

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentChunk = (x: number, y: number) => {
    this.currentChunkX = x
    this.currentChunkY = y
  }

  setScale = (scale: number) => {
    this.scale = scale
  }
}

export const planeStore = new PlaneStore()
