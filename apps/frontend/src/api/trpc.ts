import { isClient } from '@/shared/functions/isClient'
import type { AppRouter } from '@inclare/backend'
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  httpSubscriptionLink,
  splitLink
} from '@trpc/client'
import SuperJSON from 'superjson'

export const api = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: `${String(isClient ? process.env.NEXT_PUBLIC_API_URL : process.env.API_URL)}/trpc`,
        transformer: SuperJSON
      }),
      false: httpLink({
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
    })
  ]
})
