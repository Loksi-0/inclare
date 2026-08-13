import gsap from 'gsap'
import { makeAutoObservable } from 'mobx'

class PostStore {
  postId: string | null = null
  postHeight: number | null = null
  isOpen = false
  bodyRef: HTMLElement | null = null

  constructor() {
    makeAutoObservable(this)
  }

  open = (id: string, offset?: number) => {
    if (!this.bodyRef) {
      return
    }

    const maxHeight = window.innerHeight * 0.7
    const minHeight = window.innerHeight * 0.4

    const offsetHeight = offset
      ? Math.max(Math.min(window.innerHeight - offset, maxHeight), minHeight)
      : maxHeight

    this.postHeight = offsetHeight

    this.postId = id
    this.isOpen = true
    gsap.to(this.bodyRef, {
      y: offsetHeight * -1,
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
