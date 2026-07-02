'use client'

import type { PropsWithChildren } from 'react'
import Providers from './Providers'
import { Toaster } from 'sonner'

const App = ({ children }: PropsWithChildren) => {
  return (
    <Providers>
      <Toaster
        position='top-center'
        dir='auto'
      />
      {children}
    </Providers>
  )
}

export default App
