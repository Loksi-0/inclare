'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSchema } from '@repo/validators'
import { useMemo, useRef, useState } from 'react'
import { useTRPC } from '@/shared/api/tanstack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { randomCode } from '@/shared/functions/randomCode'
import type { api } from '@/shared/api/trpc'
import type { ApiReturnType } from '@/shared/types/globals'

export type UpdateProfileProps = {
  data: ApiReturnType<typeof api.user.me.query>
}

export const useUpdateProfile = ({ data: initialData }: UpdateProfileProps) => {
  const [avatar, setAvatar] = useState<File | null>(null)
  const wasAvatarChanged = useRef(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data } = useQuery(
    trpc.user.me.queryOptions(undefined, { initialData })
  )
  const { mutateAsync: updateAvatar, isPending: isAvatarPending } = useMutation(
    trpc.user.setAvatar.mutationOptions()
  )
  const { mutateAsync: updateUser, isPending: isUserPending } = useMutation(
    trpc.user.update.mutationOptions()
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: zodResolver(UserSchema.update),
    defaultValues: {
      name: data.name,
      description: data.description
    }
  })

  const [name, description] = useWatch({
    name: ['name', 'description'],
    control
  })

  const onSubmit = async (data: UserSchema.Update) => {
    if (wasAvatarChanged.current) {
      const formData = new FormData()

      if (avatar) {
        const avatarExt = avatar.name.split('.').at(-1)
        formData.append(
          'file',
          avatar,
          `${randomCode(6)}.${avatarExt || 'jpg'}`
        )
      }

      await updateAvatar(formData)
    }

    await updateUser(data)
    await queryClient.invalidateQueries({ queryKey: trpc.user.me.queryKey() })
    wasAvatarChanged.current = false
  }

  const isButtonDisabled = useMemo(() => {
    return (
      !wasAvatarChanged.current &&
      data.name === name &&
      data.description === description
    )
  }, [wasAvatarChanged.current, data, name, description])

  return {
    data,
    register,
    errors,
    handleSubmit,
    onSubmit,
    avatar,
    setAvatar,
    wasAvatarChanged,
    isAvatarPending,
    isUserPending,
    isButtonDisabled
  }
}
