'use client'

import { getQueryClient, TRPCProvider } from '@/api/tanstack'
import { api } from '@/api/trpc'
import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={api}
        queryClient={queryClient}
      >
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export default Providers
