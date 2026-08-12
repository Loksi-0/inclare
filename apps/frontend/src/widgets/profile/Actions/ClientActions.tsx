'use client'

import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import styles from './Actions.module.scss'
import { decline } from '@/shared/functions/decline'
import { PAGES } from '@/constants'
import { useTRPC } from '@/api/tanstack'
import { useQuery } from '@tanstack/react-query'

type ClientActionsProps = {
  draftedLength: number
}

const ClientActions = (props: ClientActionsProps) => {
  const { draftedLength: initialData } = props

  const trpc = useTRPC()
  const { data: draftedLength } = useQuery(
    trpc.post.my.getDraftedLength.queryOptions(undefined, { initialData })
  )

  return (
    <div className={styles.actions}>
      <Button
        className={styles.actions__button}
        color='solid'
        navigate={PAGES.DRAFTS}
      >
        {decline.male(draftedLength, 'черновик')}
      </Button>
      <Button
        className={styles.actions__button}
        color='solid'
        onClick={() => {
          postStore.open(`cms4bisen00009wi84qh0qgy6`)
        }}
      >
        загрузить пачку
      </Button>
    </div>
  )
}

export default ClientActions
