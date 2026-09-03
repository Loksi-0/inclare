import { isClient } from '@/shared/functions/isClient'
import type { TrpcRouter } from '@inclare/backend'
import { API_BASE_URL } from '@repo/constants'
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  httpSubscriptionLink,
  isNonJsonSerializable,
  splitLink
} from '@trpc/client'
import SuperJSON from 'superjson'

const apiUrl = `${String(isClient ? process.env.NEXT_PUBLIC_API_URL : process.env.API_URL)}${API_BASE_URL}`

const linkOptions = {
  url: apiUrl,
  transformer: SuperJSON
}

const cookiesFetch = async (
  url: URL | RequestInfo,
  options: RequestInit | undefined
) => {
  return fetch(url, {
    ...options,
    credentials: 'include'
  })
}

export const api = createTRPCClient<TrpcRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink(linkOptions),
      false: splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          url: apiUrl,
          transformer: {
            serialize: (data) => data,
            deserialize: (data) => SuperJSON.deserialize(data)
          },
          fetch: cookiesFetch
        }),
        false: httpBatchLink({
          ...linkOptions,
          fetch: cookiesFetch,
          headers: async () => {
            if (!isClient) {
              const { cookies } = await import('next/headers')
              const cookiesStore = await cookies()

              return {
                cookie: cookiesStore.toString()
              }
            }

            return {}
          }
        })
      })
    })
  ]
})
