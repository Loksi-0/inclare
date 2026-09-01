import { UI } from '@/constants'
import { makeAutoObservable } from 'mobx'

class TimelineStore {
  timelineRef: HTMLElement | null = null
  offset: number | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setOffset = () => {
    if (!this.timelineRef) {
      this.offset = null
      return
    }

    this.offset = this.timelineRef.offsetHeight + UI.TIMELINE_PADDING * 2
  }
}

export const timelineStore = new TimelineStore()
