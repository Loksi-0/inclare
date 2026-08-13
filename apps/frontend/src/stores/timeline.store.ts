import { makeAutoObservable } from 'mobx'

class TimelineStore {
  timelineRef: HTMLElement | null = null

  constructor() {
    makeAutoObservable(this)
  }
}

export const timelineStore = new TimelineStore()
