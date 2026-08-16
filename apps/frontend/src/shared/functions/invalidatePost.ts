import type { useTRPC } from '@/api/tanstack'
import type { QueryClient } from '@tanstack/react-query'

type Props = {
  queryClient: QueryClient
  trpc: ReturnType<typeof useTRPC>
  exceptGetOne?: boolean
}

export const invalidatePost = async ({
  queryClient,
  trpc,
  exceptGetOne = true
}: Props) => {
  await queryClient.invalidateQueries({
    ...trpc.post.pathFilter(),
    predicate: exceptGetOne
      ? (query) => {
          const pathArray = Array.isArray(query.queryKey[0])
            ? query.queryKey[0]
            : []

          const isGetOne = pathArray.includes('getOne')

          return !isGetOne
        }
      : undefined
  })
}
