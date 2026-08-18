import { isClient } from '@/shared/functions/isClient'
import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

class PreferencesStore {
  enableSoundEffects = true

  constructor() {
    if (!isClient) {
      return
    }

    makeAutoObservable(this)
    void makePersistable(this, {
      name: 'preferences',
      properties: ['enableSoundEffects'],
      storage: window.localStorage
    })
  }

  setSoundEffects = (bool: boolean) => {
    this.enableSoundEffects = bool
  }
}

export const preferencesStore = new PreferencesStore()
