'use client'

import { useTRPC } from '@/api/tanstack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidatePost } from '@/shared/functions/invalidatePost'
import { useState } from 'react'
import { postStore } from '@/stores/post.store'
import ConfirmButton from '../ConfirmButton'

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
    <ConfirmButton
      color='outlined'
      content={{
        title: 'Вы точно хотите удалить пачку?',
        reject: 'отменить',
        confirm: 'удалить'
      }}
      onConfirm={() => {
        mutate({ id })
      }}
      loading={isPending}
    >
      удалить пачку
    </ConfirmButton>
  )
}

export default DeleteButton
