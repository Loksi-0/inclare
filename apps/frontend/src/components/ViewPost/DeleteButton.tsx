'use client'

import { useTRPC } from '@/api/tanstack'
import Button from '../Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidatePost } from '@/shared/functions/invalidatePost'
import { useState } from 'react'
import { postStore } from '@/stores/post.store'

const DeleteButton = ({ id }: { id: string }) => {
  const [isPending, setIsPending] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { mutate } = useMutation(
    trpc.post.my.delete.mutationOptions({
      onMutate: () => {
        setIsPending(true)
      },
      onSuccess: async () => {
        await invalidatePost({ queryClient, trpc })
        postStore.close()
        setIsPending(false)
      }
    })
  )

  return (
    <Button
      color='outlined'
      loading={isPending}
      animate
      onClick={() => {
        mutate({ id })
      }}
    >
      удалить пачку
    </Button>
  )
}

export default DeleteButton
