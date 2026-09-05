'use client'

import Button from '@/shared/ui/Button'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { useOpenPost } from '@/shared/hooks/useOpenPost'
import { observer } from 'mobx-react-lite'
import styles from './Actions.module.scss'

const Actions = observer(() => {
  const { back } = useNavigate()
  const actionsRef = useOpenPost()

  return (
    <div
      ref={actionsRef}
      className={styles.actions}
    >
      <Button
        className='align-start'
        color='solid'
        onClick={() => {
          back()
        }}
      >
        {'<-'} назад
      </Button>
    </div>
  )
})

export default Actions
