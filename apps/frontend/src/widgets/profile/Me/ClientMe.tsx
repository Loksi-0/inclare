'use client'

import styles from './Me.module.scss'
import cx from 'clsx'
import Button from '@/components/Button'
import { PAGES } from '@/constants'
import type { api } from '@/api/trpc'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import Image from 'next/image'
import { hideEmail } from '@/shared/functions/hideEmail'
import type { ApiReturnType } from '@/types/globals'
import Avatar from '@/components/Avatar'

type ClientMeProps = {
  data: ApiReturnType<typeof api.auth.me.query>
}

const ClientMe = (props: ClientMeProps) => {
  const { data: initialData } = props

  const trpc = useTRPC()
  const { data: me } = useQuery(
    trpc.auth.me.queryOptions(undefined, { initialData })
  )

  return (
    <section className={styles.me}>
      <div className={styles.me__body}>
        <div className={styles.me__profile}>
          <Avatar
            className={styles.me__avatar}
            src={me.avatar}
            width={120}
            height={120}
          />
          <div className={styles.me__content}>
            <h1>{me.name}</h1>
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
          <Button
            className='align-end'
            navigate={PAGES.SETTINGS}
            color='outlined'
          >
            ред. профиль
          </Button>
        </div>
      </div>
      <Button
        className={cx('align-start', 'visible-mobile')}
        navigate={PAGES.SETTINGS}
        color='outlined'
      >
        ред. профиль
      </Button>
    </section>
  )
}

export default ClientMe
