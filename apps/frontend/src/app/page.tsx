'use client'

import { api } from '@/api/trpc'
import { useEffect, useState } from 'react'

const TestPage = () => {
  const [feed, setFeed] = useState<{ id: string }[]>([])

  useEffect(() => {
    const send = async () => {
      const response = await api.post.public.getFeed.query()

      setFeed(response)
    }

    const subscription = api.post.public.fallingStar.subscribe(undefined, {
      onData: (d) => {
        console.log(d)
      }
    })

    void send()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return feed.map((p, i) => (
    <p
      key={i}
      onClick={() => {
        const onClick = async () => {
          const like = await api.post.toggleLike.mutate({ id: p.id })

          console.log(like)
        }

        void onClick()
      }}
    >
      {p.id}
    </p>
  ))
}

export default TestPage
