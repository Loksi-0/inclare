import { isClient } from '@/shared/functions/isClient'
import type { AppRouter } from '@inclare/backend'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${String(isClient ? process.env.NEXT_PUBLIC_API_URL : process.env.API_URL)}/trpc`,
      transformer: SuperJSON,

      headers: () => {
        return {}
      },

      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include'
        })
      }
    })
  ]
})
