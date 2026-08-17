'use client'

import type { api } from '@/api/trpc'
import styles from './DraftsList.module.scss'
import Photo from '@/components/Photo'
import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import { PAGES } from '@/constants'
import { randomInt } from '@/shared/functions/randomInt'
import { useMemo } from 'react'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'

type DraftsProps = {
  data: Awaited<ReturnType<typeof api.post.my.getDrafted.query>>
}

const ClientDrafts = ({ data: initialData }: DraftsProps) => {
  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.post.my.getDrafted.queryOptions(undefined, { initialData })
  )

  const cardsRotations = useMemo(() => {
    return data.map(() => randomInt(-2, 2))
  }, [data])
  const { isMounted } = useIsMounted()

  return (
    <section className={styles.drafts}>
      <header className={styles.drafts__header}>
        <Button
          color='underline'
          navigate={PAGES.PROFILE}
        >
          {'<-'} назад
        </Button>
      </header>
      <div className={styles.drafts__grid}>
        {isMounted &&
          data.map((d, i) => (
            <Button
              key={d.id}
              color='icon'
              onClick={() => {
                postStore.open(d.id)
              }}
              style={{
                zIndex: i * 10
              }}
            >
              <Photo
                className={styles.drafts__item}
                src={d.previewUrl}
                style={{
                  transform: `rotate(${cardsRotations[i]}deg)`
                }}
              />
            </Button>
          ))}
      </div>
    </section>
  )
}

export default ClientDrafts
