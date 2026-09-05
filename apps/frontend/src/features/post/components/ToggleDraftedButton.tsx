'use client'

import { useTRPC } from '@/shared/api/tanstack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '@/shared/ui/Button'
import { useState } from 'react'
import { invalidatePost } from '@/shared/functions/invalidatePost'
import { postStore } from '../post.store'

type ToggleDraftedButtonProps = {
  id: string
  isDrafted: boolean
}

const ToggleDraftedButton = (props: ToggleDraftedButtonProps) => {
  const { id, isDrafted } = props

  const [isPending, setIsPending] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { mutate } = useMutation(
    trpc.post.my.toggleIsDrafted.mutationOptions({
      onMutate: () => {
        setIsPending(true)
      },
      onSuccess: async () => {
        await invalidatePost({ queryClient, trpc, exceptGetOne: false })
        setIsPending(false)
        postStore.close()
      }
    })
  )

  return (
    <Button
      color='outlined'
      loading={isPending}
      onClick={() => {
        mutate({ id })
      }}
      animate
    >
      {isDrafted ? 'опубликовать' : 'сделать черновиком'}
    </Button>
  )
}

export default ToggleDraftedButton
