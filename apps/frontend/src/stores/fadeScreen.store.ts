import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class FadeScreenStore {
  screenElement: HTMLDivElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  open = (onComplete?: () => void) => {
    gsap.to(this.screenElement, {
      opacity: 0.97,
      duration: 0.5,
      ease: 'power3.out',
      onComplete
    })
  }

  close = (onComplete?: () => void) => {
    gsap.to(this.screenElement, {
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
      onComplete
    })
  }
}

export const fadeScreenStore = new FadeScreenStore()
