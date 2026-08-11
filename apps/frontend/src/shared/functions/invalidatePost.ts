'use client'

import { useTRPC } from '@/api/tanstack'
import { type QueryClient } from '@tanstack/react-query'

type InvalidateProps = {
  queryClient: QueryClient
  trpc: ReturnType<typeof useTRPC>
}

export const invalidatePost = async ({
  queryClient,
  trpc
}: InvalidateProps) => {
  await queryClient.invalidateQueries({
    queryKey: trpc.post.getOne.queryKey()
  })
  await queryClient.invalidateQueries({
    queryKey: trpc.post.my.getPublished.queryKey()
  })
  await queryClient.invalidateQueries({
    queryKey: trpc.post.my.getDrafted.queryKey()
  })
  await queryClient.invalidateQueries({
    queryKey: trpc.post.my.getDraftedLength.queryKey()
  })
}
