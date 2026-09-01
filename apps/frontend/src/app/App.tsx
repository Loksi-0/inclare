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
import { usePathname } from 'next/navigation'
import { imageModalStore } from '@/stores/imageModal.store'
import { onboardingStore } from '@/stores/onboarding.store'
import { photoModalStore } from '@/stores/photoModal.store'
import { postStore } from '@/stores/post.store'

const App = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()

  useEffect(() => {
    void soundStore.init()
    void preferencesStore.initTheme()
  }, [])

  useEffect(() => {
    postStore.closeInstantly()
    photoModalStore.close()
    imageModalStore.close()
    onboardingStore.close()
  }, [pathname])

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
