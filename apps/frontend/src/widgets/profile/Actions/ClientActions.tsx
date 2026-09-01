'use client'

import Button from '@/components/Button'
import { decline } from '@/shared/functions/decline'
import { PAGES, UI } from '@/constants'
import { observer } from 'mobx-react-lite'
import { useActions } from './useActions'
import { postStore } from '@/stores/post.store'
import { timelineStore } from '@/stores/timeline.store'
import styles from './Actions.module.scss'

type ClientActionsProps = {
  draftedLength: number
}

const ClientActions = observer((props: ClientActionsProps) => {
  const { draftedLength: initialData } = props

  const { actionsRef, draftedLength, isPostOpen } = useActions(initialData)

  return (
    <div
      ref={actionsRef}
      className={styles.actions}
      inert={isPostOpen}
    >
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
          postStore.openUpload(timelineStore.offset)
        }}
      >
        загрузить пачку
      </Button>
    </div>
  )
})

export default ClientActions
