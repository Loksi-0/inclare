'use client'

import { useTRPC } from '@/api/tanstack'
import { useQuery } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'

const TestPage = () => {
  const trpc = useTRPC()

  const { data } = useQuery(trpc.post.my.getDrafted.queryOptions())
  const subscription = useSubscription(
    trpc.post.public.fallingStar.subscriptionOptions()
  )

  if (!data) {
    return <p>загрузка</p>
  }

  return (
    <>
      <p>{subscription.data}</p>
      {data.map((p, i) => (
        <p key={i}>{p.id}</p>
      ))}
    </>
  )
}

export default TestPage
