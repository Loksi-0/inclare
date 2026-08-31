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
import ImageModal from '@/components/ImageModal'
import { postStore } from '@/stores/post.store'
import { photoModalStore } from '@/stores/photoModal.store'
import { imageModalStore } from '@/stores/imageModal.store'
import { onboardingStore } from '@/stores/onboarding.store'

const App = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    void soundStore.init()
    void preferencesStore.initTheme()

    const onPopstate = () => {
      postStore.close()
      photoModalStore.close()
      imageModalStore.close()
      onboardingStore.close()
    }

    window.addEventListener('popstate', onPopstate)

    return () => {
      window.removeEventListener('popstate', onPopstate)
    }
  }, [])

  return (
    <Providers>
      <Toaster
        position='top-center'
        dir='auto'
      />
      <Cursor />
      <ImageModal />
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
