'use client'

import { useEffect, type PropsWithChildren } from 'react'
import Providers from './Providers'
import { Toaster } from 'sonner'
import Effector from '@/features/effector'
import Cursor from '@/features/cursor'
import ViewPost from '@/features/post'
import UploadPost from '@/features/upload'
import PhotoModal from '@/features/photoModal'
import ImageModal from '@/features/imageModal'
import Onboarding from '@/features/onboarding'
import Main from '@/features/main'
import { usePathname } from 'next/navigation'
import { imageModalStore } from '@/features/imageModal'
import { onboardingStore } from '@/features/onboarding'
import { photoModalStore } from '@/features/photoModal'
import { postStore } from '@/features/post'

const App = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()

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
