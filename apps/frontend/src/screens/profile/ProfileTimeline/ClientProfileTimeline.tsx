'use client'

import Misted from '@/shared/ui/Misted'
import Logo from '@/shared/icons/Logo'
import Button from '@/shared/ui/Button'
import Timeline from '@/features/timeline'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/shared/api/tanstack'
import type { api } from '@/shared/api/trpc'
import { postStore } from '@/features/post/post.store'
import { timelineStore } from '@/features/timeline/timeline.store'
import type { ApiReturnType } from '@/shared/types/globals'
import styles from './ProfileTimeline.module.scss'
import { useSwipe } from '@/shared/hooks/useSwipe'
import { observer } from 'mobx-react-lite'
import { photoModalStore } from '@/features/photoModal/photoModal.store'
import { imageModalStore } from '@/features/imageModal/imageModal.store'

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
        postStore.isOpen ||
        photoModalStore.isOpen ||
        imageModalStore.isOpen ||
        imageModalStore.isClosing ||
        postStore.isUploading
      ) {
        return
      }

      postStore.openUpload()
    }
  })

  if (!data || !data.at(0)) {
    timelineStore.setRef({ current: null })

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
