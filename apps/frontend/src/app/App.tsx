'use client'

import { type PropsWithChildren } from 'react'
import Providers from './Providers'
import { Toaster } from 'sonner'
import FadeScreen from '@/components/FadeScreen'
import Effector from '@/components/Effector'
import Cursor from '@/components/Cursor'
import { isTouchscreen } from '@/shared/functions/isTouchscreen'
import { useIsMounted } from '@/shared/hooks/useIsMounted'

const App = ({ children }: PropsWithChildren) => {
  const { isMounted } = useIsMounted()

  return (
    <Providers>
      <Toaster
        position='top-center'
        dir='auto'
      />
      <FadeScreen />
      {!isTouchscreen && isMounted && <Cursor />}
      <Effector>{children}</Effector>
    </Providers>
  )
}

export default App
