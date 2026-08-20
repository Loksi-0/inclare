'use client'

import type { api } from '@/api/trpc'
import styles from './DraftsList.module.scss'
import Photo from '@/components/Photo'
import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import { randomInt } from '@/shared/functions/randomInt'
import { useMemo } from 'react'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import DraftsLayout from '@/layouts/DraftsLayout'

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

  if (!data.at(0)) {
    return (
      <DraftsLayout>
        <div className={styles.drafts__placeholder}>
          у вас пока нет черновиков
        </div>
      </DraftsLayout>
    )
  }

  return (
    <DraftsLayout>
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
    </DraftsLayout>
  )
}

export default ClientDrafts
