'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTRPC } from '@/shared/api/tanstack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadStore } from './upload.store'
import { invalidatePost } from '@/shared/functions/invalidatePost'
import { postStore } from '@/features/post'

export const useUpload = () => {
  const [postId, setPostId] = useState<string | null>(null)
  const [description, setDescription] = useState<string>()
  const [files, setFiles] = useState<File[]>([])
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { mutate: createPost, isPending } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: (d) => {
        setPostId(d.id)
      }
    })
  )
  const { mutate: toggleIsDrafted, isPending: isPublishPending } = useMutation(
    trpc.post.my.toggleIsDrafted.mutationOptions()
  )
  const { mutateAsync: sendDescription, isPending: isDescriptionPending } =
    useMutation(trpc.post.my.setDescription.mutationOptions())

  useEffect(() => {
    uploadStore.setTotal(files.length)
  }, [files])

  const now = useMemo(() => {
    return new Date()
  }, [])

  const uploadPercentage = useMemo(() => {
    return Math.max(
      Math.min(
        Math.ceil((uploadStore.settledPhotos / uploadStore.totalPhotos) * 100),
        100
      ),
      0
    )
  }, [uploadStore.totalPhotos, uploadStore.settledPhotos])

  const onInput = (files: FileList | null) => {
    if (!files) {
      return
    }

    createPost({})
    setFiles([...files])
  }

  const addMore = (f: FileList | null) => {
    if (f) {
      setFiles([...files, ...f])
    }
  }

  const closeUpload = async () => {
    await invalidatePost({ queryClient, trpc })
    postStore.close(() => {
      setPostId(null)
      setFiles([])
      setDescription(undefined)
    })
    uploadStore.reset()
  }

  const onDraft = async () => {
    if (!postId) {
      return
    }

    if (description) {
      await sendDescription({ id: postId, description })
    }

    closeUpload()
  }

  const onPublish = async () => {
    if (!postId) {
      return
    }

    if (description) {
      await sendDescription({ id: postId, description })
    }

    toggleIsDrafted({ id: postId }, { onSuccess: closeUpload })
  }

  return {
    now,
    postId,
    files,
    addMore,
    isPending,
    isPublishPending,
    isDescriptionPending,
    description,
    setDescription,
    uploadPercentage,
    onDraft,
    onPublish,
    onInput
  }
}
