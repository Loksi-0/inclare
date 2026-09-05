'use client'

import { useTRPC } from '@/shared/api/tanstack'
import { useQuery } from '@tanstack/react-query'
import { postStore } from '@/features/post/post.store'
import { useOpenPost } from '@/shared/hooks/useOpenPost'

export const useActions = (initialData: number) => {
  const actionsRef = useOpenPost()
  const trpc = useTRPC()
  const { data: draftedLength } = useQuery(
    trpc.post.my.getDraftedLength.queryOptions(undefined, { initialData })
  )

  return {
    actionsRef,
    draftedLength,
    isPostOpen: postStore.isOpen
  }
}
