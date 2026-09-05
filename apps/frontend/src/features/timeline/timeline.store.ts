import { makeAutoObservable } from 'mobx'
import { UI } from '@/constants'
import type { RefObject } from 'react'

class TimelineStore {
  timelineRef: RefObject<HTMLElement | null> = { current: null }

  constructor() {
    makeAutoObservable(this)
  }

  getOffset = () => {
    if (!this.timelineRef.current) {
      return null
    }

    return this.timelineRef.current.clientHeight + UI.TIMELINE_PADDING * 2
  }

  setRef = (ref: RefObject<HTMLElement | null>) => {
    this.timelineRef = ref
  }
}

export const timelineStore = new TimelineStore()
