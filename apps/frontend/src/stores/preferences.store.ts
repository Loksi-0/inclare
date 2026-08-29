import { isClient } from '@/shared/functions/isClient'
import { makeAutoObservable } from 'mobx'
import { makePersistable, stopPersisting } from 'mobx-persist-store'

class PreferencesStore {
  hideCursor = false
  darkTheme = false

  constructor() {
    makeAutoObservable(this)

    if (!isClient) {
      return
    }

    void stopPersisting(this)
    makePersistable(this, {
      name: 'preferences',
      properties: ['hideCursor', 'darkTheme'],
      storage: window.localStorage
    })
  }

  setHideCursor = (bool: boolean) => {
    this.hideCursor = bool
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
