import { makeAutoObservable } from 'mobx'
import { UI } from '@/constants'

class TimelineStore {
  timelineRef: HTMLElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  getOffset = () => {
    if (!this.timelineRef) {
      return null
    }

    return this.timelineRef.clientHeight + UI.TIMELINE_PADDING * 2
  }
}

export const timelineStore = new TimelineStore()
