'use client'

import { api } from '@/api/trpc'
import { useEffect } from 'react'

const TestPage = () => {
  useEffect(() => {
    const send = async () => {
      const response = await api.auth.login.mutate({
        email: 'egloksi23@gmail.com',
        password: '123123'
      })

      console.log(response)
    }

    void send()
  }, [])

  const upload = async (file?: File | null) => {
    if (!file) {
      return
    }

    const post = await api.post.create.mutate({})

    const formData = new FormData()
    formData.append('file', file)
    formData.append('postId', post.id)
    formData.append('order', '1')

    await api.photo.upload.mutate(formData)
    await api.post.my.toggleIsDrafted.mutate({ id: post.id })

    const response = await api.post.my.getAll.query()

    console.log(response)
  }

  return (
    <input
      type='file'
      onChange={(e) => {
        void upload(e.target.files?.item(0))
      }}
    ></input>
  )
}

export default TestPage
