import { dateToMonth } from '@/shared/functions/dateToMonth'
import Avatar from '../Avatar'
import AuthorButton from './AuthorButton'
import cx from 'clsx'
import styles from './AuthorHeader.module.scss'

type AuthorHeaderProps = {
  isMy: boolean
  clickable: boolean
  authorId: string
  authorName: string
  avatar: string | null
  createdAt: Date
  className?: string
}

const AuthorHeader = (props: AuthorHeaderProps) => {
  const {
    isMy,
    clickable,
    authorId,
    authorName,
    avatar,
    createdAt,
    className
  } = props

  return (
    <AuthorButton
      className={cx(styles.header__author, className)}
      clickable={clickable}
      authorId={authorId}
    >
      {!isMy && (
        <Avatar
          className={styles.header__avatar}
          src={avatar}
          width={40}
          height={40}
        />
      )}
      <div className='mono subtitle'>
        {isMy ? 'me' : authorName} / {dateToMonth(createdAt)}{' '}
        {createdAt.getDate()}
      </div>
    </AuthorButton>
  )
}

export default AuthorHeader
