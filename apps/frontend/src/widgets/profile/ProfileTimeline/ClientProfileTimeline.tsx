'use client'

import Misted from '@/components/Misted'
import styles from './ProfileTimeline.module.scss'
import Logo from '@/icons/Logo'
import Button from '@/components/Button'
import Timeline from '@/components/Timeline'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import type { api } from '@/api/trpc'

type ClientTimelineProps = {
  data: Awaited<ReturnType<typeof api.post.my.getPublished.query>>
}

const ClientProfileTimeline = (props: ClientTimelineProps) => {
  const { data: initialData } = props

  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.post.my.getPublished.queryOptions(undefined, {
      initialData
    })
  )

  if (!data || !data.at(0)) {
    return (
      <section className={styles.timeline}>
        <Misted size={10}>
          <div className={styles.timeline__logo}>
            <Logo />
          </div>
        </Misted>
        <div className={styles.timeline__body}>
          <h2>У вас пока что нет постов</h2>
          <Button color='outlined'>загрузить пачку</Button>
        </div>
      </section>
    )
  }

  return <Timeline data={data} />
}

export default ClientProfileTimeline
