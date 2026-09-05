'use client'

import cx from 'clsx'
import Button from '@/shared/ui/Button'
import { PAGES } from '@/constants'
import type { api } from '@/shared/api/trpc'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/shared/api/tanstack'
import { hideEmail } from '@/shared/functions/hideEmail'
import type { ApiReturnType } from '@/shared/types/globals'
import Avatar from '@/features/avatar'
import styles from './Me.module.scss'
import { shareProfile } from '@/shared/functions/shareProfile'

type ClientMeProps = {
  data: ApiReturnType<typeof api.user.me.query>
}

const ClientMe = (props: ClientMeProps) => {
  const { data: initialData } = props

  const trpc = useTRPC()
  const { data: me } = useQuery(
    trpc.user.me.queryOptions(undefined, { initialData })
  )

  const Actions = ({ mobile = false }: { mobile?: boolean }) => {
    return (
      <div className={cx(styles.me__buttons, [{ [styles.mobile]: mobile }])}>
        {me.role === 'MODERATOR' ||
          (me.role === 'ADMIN' && (
            <Button
              color='outlined'
              navigate={PAGES.MODERATOR}
            >
              админка
            </Button>
          ))}
        <Button
          navigate={PAGES.SETTINGS}
          color='outlined'
        >
          настройки
        </Button>
      </div>
    )
  }

  return (
    <section className={styles.me}>
      <div className={styles.me__body}>
        <div className={styles.me__profile}>
          <Avatar
            className={styles.me__avatar}
            src={me.avatar}
            width={200}
            height={200}
            expandable
          />
          <div className={styles.me__content}>
            <Button
              className='h1'
              color='underline'
              onClick={() => shareProfile(me.id)}
            >
              {me.name}
            </Button>
            {me.description && <p>{me.description}</p>}
          </div>
        </div>
        <div className={cx(styles.me__info, 'hidden-mobile')}>
          <ul className={styles.me__list}>
            <li className={cx(styles.me__item, styles.accent)}>
              <p>status</p>
              <p>{me.isPrivate ? 'private' : 'public'}</p>
            </li>
            <li className={styles.me__item}>
              <p>total_archived</p>
              <p>{me.totalArchived} pcs</p>
            </li>
            <li className={styles.me__item}>
              <p>email</p>
              <p>{hideEmail(me.email)}</p>
            </li>
            <li className={styles.me__item}>
              <p>role</p>
              <p>{me.role}</p>
            </li>
          </ul>
          <Actions />
        </div>
      </div>
      <Actions mobile />
    </section>
  )
}

export default ClientMe
