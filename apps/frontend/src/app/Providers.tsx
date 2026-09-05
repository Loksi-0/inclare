'use client'

import { getQueryClient, TRPCProvider } from '@/shared/api/tanstack'
import { api } from '@/shared/api/trpc'
import { PreferencesProvider } from '@/shared/providers/preferences.provider'
import { SoundProvider } from '@/shared/providers/sound.provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type PropsWithChildren } from 'react'

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() => api)

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        <SoundProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </SoundProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export default Providers
