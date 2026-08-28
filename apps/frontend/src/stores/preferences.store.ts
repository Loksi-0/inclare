import { isClient } from '@/shared/functions/isClient'
import { makeAutoObservable } from 'mobx'
import { makePersistable, stopPersisting } from 'mobx-persist-store'

class PreferencesStore {
  hideCursor = false

  constructor() {
    makeAutoObservable(this)

    if (!isClient) {
      return
    }

    void stopPersisting(this)
    makePersistable(this, {
      name: 'preferences',
      properties: ['hideCursor'],
      storage: window.localStorage
    })
  }

  setHideCursor = (bool: boolean) => {
    this.hideCursor = bool
  }
}

export const preferencesStore = new PreferencesStore()
