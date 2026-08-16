'use client'

import { getQueryClient, TRPCProvider } from '@/api/tanstack'
import { api } from '@/api/trpc'
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
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export default Providers
