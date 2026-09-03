import { UI } from '@/constants'
import { makeAutoObservable } from 'mobx'

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
