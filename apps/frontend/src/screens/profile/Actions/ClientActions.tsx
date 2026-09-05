'use client'

import Button from '@/shared/ui/Button'
import { decline } from '@/shared/functions/decline'
import { PAGES } from '@/constants'
import { observer } from 'mobx-react-lite'
import { useActions } from './useActions'
import styles from './Actions.module.scss'
import { postStore } from '@/features/post'

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
          postStore.openUpload()
        }}
      >
        загрузить пачку
      </Button>
    </div>
  )
})

export default ClientActions
