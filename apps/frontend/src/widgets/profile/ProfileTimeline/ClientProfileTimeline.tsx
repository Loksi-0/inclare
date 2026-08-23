'use client'

import Misted from '@/components/Misted'
import styles from './ProfileTimeline.module.scss'
import Logo from '@/icons/Logo'
import Button from '@/components/Button'
import Timeline from '@/components/Timeline'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import type { api } from '@/api/trpc'
import { postStore } from '@/stores/post.store'
import { timelineStore } from '@/stores/timeline.store'
import type { ApiReturnType } from '@/types/globals'

type ClientTimelineProps = {
  data: ApiReturnType<typeof api.post.my.getPublished.query>
  me: ApiReturnType<typeof api.auth.me.query>
}

const ClientProfileTimeline = (props: ClientTimelineProps) => {
  const { data: initialData, me: initialMe } = props

  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.post.my.getPublished.queryOptions(undefined, {
      initialData
    })
  )
  const { data: me } = useQuery(
    trpc.auth.me.queryOptions(undefined, { initialData: initialMe })
  )

  if (!data || !data.at(0)) {
    timelineStore.timelineRef = null

    return (
      <section className={styles.timeline}>
        <Misted size={10}>
          <div className={styles.timeline__logo}>
            <Logo />
          </div>
        </Misted>
        <div className={styles.timeline__body}>
          <h2>У вас пока что нет постов</h2>
          <Button
            color='outlined'
            onClick={() => {
              postStore.openUpload()
            }}
          >
            загрузить пачку
          </Button>
        </div>
      </section>
    )
  }

  return (
    <Timeline
      unoptimized={me.isPrivate}
      data={data}
    />
  )
}

export default ClientProfileTimeline
