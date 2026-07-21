'use client'

import { useTRPC } from '@/api/tanstack'
import { PAGES } from '@/constants'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { useParallax } from '@/shared/hooks/useParallax'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthSchema } from '@repo/validators'
import { useMutation } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: zodResolver(AuthSchema.login),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const trpc = useTRPC()
  const { mutate: login, isPending } = useMutation(
    trpc.auth.login.mutationOptions()
  )
  const { push } = useNavigate()

  const { topRef, bgRef } = useParallax({
    topCoefficient: 5,
    bgCoefficient: 1
  })
  const onSubmit = (data: AuthSchema.Login) => {
    login(data, {
      onSuccess: () => {
        push(PAGES.PROFILE)
      }
    })
  }

  const [email, password] = useWatch({
    name: ['email', 'password'],
    control
  })

  return {
    topRef,
    bgRef,
    handleSubmit,
    onSubmit,
    errors,
    register,
    isPending,
    email,
    password
  }
}
