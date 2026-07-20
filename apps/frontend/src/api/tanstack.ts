'use client'

import { defineErrorMessage } from '@/shared/functions/defineErrorMessage'
import { isClient } from '@/shared/functions/isClient'
import { toast } from '@/shared/functions/toast'
import type { AppRouter } from '@inclare/backend'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { createTRPCContext } from '@trpc/tanstack-react-query'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

const makeQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (e) => {
        toast.error(defineErrorMessage(e.message))
      }
    }),
    mutationCache: new MutationCache({
      onError: (e) => {
        toast.error(defineErrorMessage(e.message))
      }
    })
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export const getQueryClient = () => {
  if (!isClient) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}
