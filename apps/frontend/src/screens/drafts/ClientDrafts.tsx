'use client'

import type { api } from '@/shared/api/trpc'
import Photo from '@/shared/ui/Photo'
import Button from '@/shared/ui/Button'
import { postStore } from '@/features/post/post.store'
import { randomInt } from '@/shared/functions/randomInt'
import { useMemo } from 'react'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/shared/api/tanstack'
import DraftsLayout from './components/drafts.layout'
import type { ApiReturnType } from '@/shared/types/globals'
import styles from './DraftsList.module.scss'

type DraftsProps = {
  data: ApiReturnType<typeof api.post.my.getDrafted.query>
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
          data.map(
            (d, i) =>
              d.previewUrl && (
                <Button
                  className={styles.drafts__button}
                  key={d.id}
                  color='icon'
                  onClick={() => {
                    postStore.open({ id: d.id })
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
              )
          )}
      </div>
    </DraftsLayout>
  )
}

export default ClientDrafts
