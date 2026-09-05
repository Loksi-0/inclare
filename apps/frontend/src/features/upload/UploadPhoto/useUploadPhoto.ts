'use client'

import { useTRPC } from '@/shared/api/tanstack'
import { randomCode } from '@/shared/functions/randomCode'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { uploadStore } from '@/features/upload/upload.store'

export type UploadPhotoProps = {
  file: File
  postId: string
  order: number
}

export const useUploadPhoto = (props: UploadPhotoProps) => {
  const { file, postId, order } = props

  const [src, setSrc] = useState<string>()
  const [isError, setIsError] = useState(false)
  const isRetry = useRef(false)
  const trpc = useTRPC()
  const { mutate: createPhoto } = useMutation(
    trpc.photo.upload.mutationOptions({
      retry: false,
      onMutate: () => {
        if (isRetry.current) {
          uploadStore.decrementSettled()
          uploadStore.decrementError()
        }

        setIsError(false)
        isRetry.current = true
      },
      onSettled: () => {
        uploadStore.incrementSettled()
      },
      onSuccess: (d) => {
        setSrc(d.optimizedUrl)
      },
      onError: () => {
        setIsError(true)
        uploadStore.incrementError()
      }
    })
  )

  const createFormData = () => {
    const formData = new FormData()

    const fileExt = file.name.split('.').at(-1)
    const safeName = `${randomCode(6)}.${fileExt || 'jpg'}`

    formData.append('file', file, safeName)
    formData.append('postId', postId)
    formData.append('order', String(order))

    return formData
  }

  useEffect(() => {
    if (isRetry.current) {
      return
    }

    createPhoto(createFormData())
  }, [])

  return {
    isError,
    createPhoto,
    createFormData,
    src
  }
}
