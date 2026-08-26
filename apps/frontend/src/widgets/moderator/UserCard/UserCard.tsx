import Avatar from '@/components/Avatar'
import styles from './UserCard.module.scss'
import type { PropsWithChildren } from 'react'
import Button from '@/components/Button'
import { PAGES } from '@/constants'

type UserCardProps = PropsWithChildren<{
  avatar: string | null
  name: string
  email: string
  userId: string
}>

const UserCard = (props: UserCardProps) => {
  const { children, avatar, name, email, userId } = props

  return (
    <div className={styles.card}>
      <Button
        color='icon'
        navigate={PAGES.USER(userId)}
        className={styles.card__body}
      >
        <Avatar
          className={styles.card__avatar}
          src={avatar}
          width={100}
          height={100}
        />
        <div className={styles.card__content}>
          <h2>{name}</h2>
          <p>{email}</p>
        </div>
      </Button>
      <div className={styles.card__actions}>{children}</div>
    </div>
  )
}

export default UserCard
