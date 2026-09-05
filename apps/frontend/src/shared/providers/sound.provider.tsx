import { useEffect, type PropsWithChildren } from 'react'
import { soundStore } from '../stores/sound.store'

export const SoundProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    soundStore.init()

    if (!soundStore.isOn) {
      return
    }

    document.addEventListener('click', soundStore.playClick)

    return () => {
      document.removeEventListener('click', soundStore.playClick)
    }
  }, [])

  return children
}
