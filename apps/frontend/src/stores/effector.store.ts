import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class EffectorStore {
  effectorRef: HTMLDivElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  zoom = (scale: number, onComplete?: () => void) => {
    gsap.to(this.effectorRef, {
      scale,
      duration: 0.6,
      ease: 'power3.out',
      onComplete
    })
  }

  zoomJump = () => {
    const tl = gsap.timeline()

    tl.to(this.effectorRef, {
      scale: 0.97,
      duration: 0.3,
      ease: 'power3.out'
    }).to(this.effectorRef, {
      scale: 1,
      duration: 0.5,
      ease: 'power3.out'
    })
  }
}

export const effectorStore = new EffectorStore()
