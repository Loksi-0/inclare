'use client'

import { api } from '@/api/trpc'
import { useEffect, useState } from 'react'

const TestPage = () => {
  const [feed, setFeed] = useState<object[]>([])

  useEffect(() => {
    const send = async () => {
      const response = await api.post.public.getFeed.query({})

      setFeed(response)
      console.log(response)
    }

    void send()
  }, [])

  return feed.map((p) => <p>{p.id}</p>)
}

export default TestPage
