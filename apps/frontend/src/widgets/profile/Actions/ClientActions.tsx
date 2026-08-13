'use client'

import Button from '@/components/Button'
import styles from './Actions.module.scss'
import { decline } from '@/shared/functions/decline'
import { PAGES } from '@/constants'
import { observer } from 'mobx-react-lite'
import { useActions } from './useActions'

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
      >
        загрузить пачку
      </Button>
    </div>
  )
})

export default ClientActions
