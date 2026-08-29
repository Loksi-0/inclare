'use client'

import { useEffect, type PropsWithChildren } from 'react'
import Providers from './Providers'
import { Toaster } from 'sonner'
import Effector from '@/components/Effector'
import Cursor from '@/components/Cursor'
import ViewPost from '@/components/ViewPost'
import PhotoModal from '@/components/PhotoModal'
import UploadPost from '@/components/UploadPost'
import { soundStore } from '@/stores/sound.store'
import Onboarding from '@/components/Onboarding'
import Main from '@/components/Main'
import { preferencesStore } from '@/stores/preferences.store'

const App = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    void soundStore.init()
    void preferencesStore.initTheme()
  }, [])

  return (
    <Providers>
      <Toaster
        position='top-center'
        dir='auto'
      />
      <Cursor />
      <PhotoModal />
      <Onboarding />
      <Effector>
        <Main>{children}</Main>
        <ViewPost />
        <UploadPost />
      </Effector>
    </Providers>
  )
}

export default App
