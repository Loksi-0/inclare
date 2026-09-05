'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postStore } from '../post.store'
import { useTRPC } from '@/shared/api/tanstack'
import ConfirmButton from '@/shared/ui/ConfirmButton'
import { invalidatePost } from '@/shared/functions/invalidatePost'

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
      onConfirm={(close) => {
        mutate({ id }, { onSuccess: close })
      }}
      loading={isPending}
    >
      удалить пачку
    </ConfirmButton>
  )
}

export default DeleteButton
