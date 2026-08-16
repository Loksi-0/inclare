'use client'

import { useTRPC } from '@/api/tanstack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '../Button'
import { useState } from 'react'
import { invalidatePost } from '@/shared/functions/invalidatePost'

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
