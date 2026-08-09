import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class PostStore {
  postId: string | null = null
  isOpen = false
  bodyRef: HTMLElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  open = (id: string) => {
    if (!this.bodyRef) {
      return
    }

    this.postId = id
    this.isOpen = true
    gsap.to(this.bodyRef, {
      y: '-70vh',
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  close = () => {
    if (!this.bodyRef) {
      return
    }

    this.isOpen = false
    gsap.to(this.bodyRef, {
      y: '0',
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

export const postStore = new PostStore()
