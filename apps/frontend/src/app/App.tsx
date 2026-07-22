'use client'

import { type PropsWithChildren } from 'react'
import Providers from './Providers'
import { Toaster } from 'sonner'
import FadeScreen from '@/components/FadeScreen'
import Effector from '@/components/Effector'

const App = ({ children }: PropsWithChildren) => {
  return (
    <Providers>
      <Toaster
        position='top-center'
        dir='auto'
      />
      <FadeScreen />
      <Effector>{children}</Effector>
    </Providers>
  )
}

export default App
