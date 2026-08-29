import { isClient } from '@/shared/functions/isClient'
import { isTouchscreen } from '@/shared/functions/isTouchscreen'
import { makeAutoObservable } from 'mobx'
import { makePersistable, stopPersisting } from 'mobx-persist-store'

type Message = {
  title: string
  description: string
}

class OnboardingStore {
  isOpen = false
  title = ''
  description = ''

  displayed = {
    timeline: false,
    plane: false,
    pixel: false
  }

  messages: Record<keyof typeof this.displayed, Message> = {
    timeline: {
      title: 'Таймлайн',
      description: `На таймлайне будут показываться все опубликованные посты в хронологическом порядке. Чтобы открыть пост, просто нажмите на фотографию. Таймлайн можно листать ${isTouchscreen ? 'пальцем' : 'мышкой'}`
    },
    plane: {
      title: 'Плоскость',
      description:
        'Плоскость - это лента самых популярных и новых постов, но в виде бесконечной 2D плоскости. Изучайте ее и ищите пасхалки'
    },
    pixel: {
      title: 'Битый пиксель',
      description:
        'Битым пикселем становятся те посты, которые резко набирали популярность, а затем угасли. Такой акцент привлекает внимание и дает второй шанс популярности поста'
    }
  }

  constructor() {
    if (!isClient) {
      return
    }

    makeAutoObservable(this)
    stopPersisting(this)
    void makePersistable(this, {
      name: 'onboarding',
      properties: ['displayed'],
      storage: window.localStorage
    })
  }

  openTimeline = () => {
    this.open('timeline')
  }

  openPlane = () => {
    this.open('plane')
  }

  openPixel = () => {
    this.open('pixel')
  }

  private open = (key: keyof typeof this.displayed) => {
    if (this.displayed[key]) {
      return
    }

    const data = this.messages[key]

    this.isOpen = true
    this.displayed[key] = true
    this.title = data.title
    this.description = data.description
  }

  close = () => {
    this.isOpen = false
  }
}

export const onboardingStore = new OnboardingStore()
