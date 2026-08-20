import { SOUNDS } from '@/constants'
import { isClient } from '@/shared/functions/isClient'
import { makeAutoObservable } from 'mobx'
import { makePersistable, stopPersisting } from 'mobx-persist-store'

class SoundStore {
  isOn = true

  prevPos: number | null = null

  isLoaded = false
  audioCtx: AudioContext | null = null

  scrollBuffer: AudioBuffer | null = null
  clickBuffer: AudioBuffer | null = null
  likeBuffer: AudioBuffer | null = null

  constructor() {
    if (!isClient) {
      return
    }

    makeAutoObservable(this, {
      audioCtx: false,
      scrollBuffer: false
    })
    stopPersisting(this)
    void makePersistable(this, {
      name: 'sounds',
      properties: ['isOn'],
      storage: window.localStorage
    })

    if (!this.isOn) {
      return
    }

    document.addEventListener('click', this.onClick)
  }

  onClick = () => {
    this.playSound(this.clickBuffer)
  }

  onLike = () => {
    this.playSound(this.likeBuffer)
  }

  onScroll = (pos: number, step: number) => {
    if (this.prevPos === null) {
      this.prevPos = pos
    }

    if (!(pos - step > this.prevPos || pos + step < this.prevPos)) {
      return
    }

    this.playSound(this.scrollBuffer)
    this.prevPos = pos
  }

  setIsOn = (bool: boolean) => {
    this.isOn = bool
  }

  setIsLoaded = (bool: boolean) => {
    this.isLoaded = bool
  }

  private playSound = (buffer: AudioBuffer | null) => {
    if (!this.isOn || !this.audioCtx || !this.isLoaded || !buffer) {
      return
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer

    source.connect(this.audioCtx.destination)
    source.start(0)
  }

  init = async () => {
    if (!isClient) {
      return
    }

    try {
      this.audioCtx = new window.AudioContext()

      const ratchet = await fetch(SOUNDS.RATCHET)
      const click = await fetch(SOUNDS.TAP)
      const like = await fetch(SOUNDS.LIKE)

      const ratchetArrBuffer = await ratchet.arrayBuffer()
      const clickArrBuffer = await click.arrayBuffer()
      const likeArrBuffer = await like.arrayBuffer()

      this.scrollBuffer = await this.audioCtx.decodeAudioData(ratchetArrBuffer)
      this.clickBuffer = await this.audioCtx.decodeAudioData(clickArrBuffer)
      this.likeBuffer = await this.audioCtx.decodeAudioData(likeArrBuffer)

      this.setIsLoaded(true)
    } catch {}
  }
}

export const soundStore = new SoundStore()
