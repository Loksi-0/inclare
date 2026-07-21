'use client'

import type { PropsWithChildren } from 'react'
import Providers from './Providers'
import { Toaster } from 'sonner'
import FadeScreen from '@/components/FadeScreen'

const App = ({ children }: PropsWithChildren) => {
  return (
    <Providers>
      <Toaster
        position='top-center'
        dir='auto'
      />
      <FadeScreen />
      {children}
    </Providers>
  )
}

export default App
