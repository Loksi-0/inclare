'use client'

import { useEffect, type PropsWithChildren } from 'react'
import { preferencesStore } from '../stores/preferences.store'

export const PreferencesProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    preferencesStore.initTheme()
  }, [])

  return children
}
