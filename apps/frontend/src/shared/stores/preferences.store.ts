import { isClient } from '@/shared/functions/isClient'
import { makeAutoObservable } from 'mobx'
import { makePersistable, stopPersisting } from 'mobx-persist-store'

class PreferencesStore {
  showCursor = true
  darkTheme = false
  enableGestures = true

  constructor() {
    makeAutoObservable(this)

    if (!isClient) {
      return
    }

    void stopPersisting(this)
    makePersistable(this, {
      name: 'preferences',
      properties: ['showCursor', 'darkTheme', 'enableGestures'],
      storage: window.localStorage
    })
  }

  setShowCursor = (bool: boolean) => {
    this.showCursor = bool
  }

  setEnableGestures = (bool: boolean) => {
    this.enableGestures = bool
  }

  setDarkTheme = (isDark: boolean) => {
    this.darkTheme = isDark
    document.documentElement.setAttribute(
      'theme',
      preferencesStore.darkTheme ? 'dark' : 'light'
    )
  }

  initTheme = () => {
    document.documentElement.setAttribute(
      'theme',
      preferencesStore.darkTheme ? 'dark' : 'light'
    )
  }
}

export const preferencesStore = new PreferencesStore()
