'use client'

import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import styles from './Actions.module.scss'

const ClientActions = () => {
  return (
    <Button
      className={styles.actions__button}
      color='solid'
      onClick={() => {
        postStore.open(`cms4bisen00009wi84qh0qgy5`)
      }}
    >
      загрузить пачку
    </Button>
  )
}

export default ClientActions
