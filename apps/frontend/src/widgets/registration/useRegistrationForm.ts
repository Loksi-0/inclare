'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthSchema } from '@repo/validators'
import { PAGES } from '@/constants'
import { useParallax } from '@/shared/hooks/useParallax'
import { toast } from '@/shared/functions/toast'
import { errorMessages } from '@/shared/functions/defineErrorMessage'
import { useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import gsap from 'gsap'
import { randomCode } from '@/shared/functions/randomCode'
import { useNavigate } from '@/shared/hooks/useNavigate'

export const useRegistrationForm = () => {
  const [screen, setScreen] = useState(1)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    formState: { errors },
    control,
    trigger,
    handleSubmit
  } = useForm({
    resolver: zodResolver(AuthSchema.register),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      description: ''
    }
  })

  const [email, password, name, description] = useWatch({
    name: ['email', 'password', 'name', 'description'],
    control
  })

  const trpc = useTRPC()
  const { refetch, isLoading: isChecking } = useQuery(
    trpc.user.checkExists.queryOptions(
      { email },
      { enabled: false, retry: false }
    )
  )
  const { mutate: registration } = useMutation(
    trpc.auth.register.mutationOptions()
  )
  const { mutate: setAvatar } = useMutation(
    trpc.user.setAvatar.mutationOptions()
  )

  const { bgRef, topRef } = useParallax({
    topCoefficient: 5,
    bgCoefficient: 1
  })

  const { push } = useNavigate()
  const formRef = useRef<HTMLFormElement | null>(null)

  const next = async () => {
    const isValid = await trigger(['email', 'password'])

    if (isValid) {
      const { data, error } = await refetch()

      if (error) {
        toast.error(error.message)
        return
      }
      if (data === true) {
        toast.error(errorMessages.AUTH_USER_EXISTS)
        return
      }

      if (formRef.current) {
        gsap.to(formRef.current, {
          y: `${-screen * 100}vh`,
          duration: 0.7,
          ease: 'power4.out'
        })
      }

      setScreen((prev) => prev + 1)
    }
  }

  const back = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        y: `${-(screen - 2) * 100}vh`,
        duration: 0.7,
        ease: 'power4.out'
      })
    }

    setScreen((prev) => prev - 1)
  }

  const onSubmit = (data: AuthSchema.Register) => {
    const end = () => {
      setIsPending(false)

      push(PAGES.PROFILE, { animate: true })
    }

    setIsPending(true)
    registration(data, {
      onSuccess: () => {
        if (avatarFile) {
          const formData = new FormData()
          formData.append('file', avatarFile, randomCode(6))

          setAvatar(formData, {
            onSettled: end
          })
        }

        end()
      }
    })
  }

  return {
    bgRef,
    topRef,
    formRef,
    handleSubmit,
    onSubmit,
    errors,
    register,
    next,
    back,
    isChecking,
    isPending,
    email,
    password,
    description,
    name,
    avatarFile,
    setAvatarFile
  }
}
