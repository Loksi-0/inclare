import { isClient } from '@/shared/functions/isClient'
import type { AppRouter } from '@inclare/backend'
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  httpSubscriptionLink,
  isNonJsonSerializable,
  splitLink
} from '@trpc/client'
import SuperJSON from 'superjson'

const linkOptions = {
  url: `${String(isClient ? process.env.NEXT_PUBLIC_API_URL : process.env.API_URL)}/trpc`,
  transformer: SuperJSON
}

const cookiesFetch = (
  url: URL | RequestInfo,
  options: RequestInit | undefined
) => {
  return fetch(url, {
    ...options,
    credentials: 'include'
  })
}

export const api = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink(linkOptions),
      false: splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          ...linkOptions,
          fetch: cookiesFetch
        }),
        false: httpBatchLink({
          ...linkOptions,
          fetch: cookiesFetch
        })
      })
    })
  ]
})
