'use client'

import Misted from '@/components/Misted'
import Logo from '@/icons/Logo'
import Button from '@/components/Button'
import Timeline from '@/components/Timeline'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import type { api } from '@/api/trpc'
import { postStore } from '@/stores/post.store'
import { timelineStore } from '@/stores/timeline.store'
import type { ApiReturnType } from '@/types/globals'
import styles from './ProfileTimeline.module.scss'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { observer } from 'mobx-react-lite'
import { photoModalStore } from '@/stores/photoModal.store'
import { imageModalStore } from '@/stores/imageModal.store'

type ClientTimelineProps = {
  data: ApiReturnType<typeof api.post.my.getPublished.query>
}

const ClientProfileTimeline = observer((props: ClientTimelineProps) => {
  const { data: initialData } = props

  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.post.my.getPublished.queryOptions(undefined, {
      initialData
    })
  )

  useSwipe({
    strength: 'light',
    onBottomToTop: () => {
      if (
        !postStore.isOpen &&
        !photoModalStore.isOpen &&
        !imageModalStore.isOpen &&
        !imageModalStore.isClosing &&
        !postStore.isUploading
      ) {
        postStore.openUpload(timelineStore.getOffset())
      }
    }
  })

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

  return <Timeline data={data} />
})

export default ClientProfileTimeline
