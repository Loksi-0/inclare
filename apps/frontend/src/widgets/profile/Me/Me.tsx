import { catchError } from '@/shared/functions/catchError'
import styles from './Me.module.scss'
import ErrorSection from '@/components/ErrorSection'
import { api } from '@/api/trpc'
import Image from 'next/image'
import cx from 'clsx'
import Button from '@/components/Button'
import { PAGES } from '@/constants'
import { hideEmail } from '@/shared/functions/hideEmail'

const Me = catchError(
  async () => {
    const me = await api.auth.me.query()

    return (
      <section className={styles.me}>
        <div className={styles.me__body}>
          <div className={styles.me__profile}>
            {me.avatar ? (
              <Image
                className={styles.me__avatar}
                src={me.avatar}
                width={120}
                height={120}
                alt=''
                draggable={false}
                unoptimized
              />
            ) : (
              <div className={styles.me__avatar}></div>
            )}
            <div className={styles.me__content}>
              <h1>{me.name}</h1>
              {me.description && <p>{me.description}</p>}
            </div>
          </div>
          <ul className={cx(styles.me__list, 'hidden-mobile')}>
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
        </div>
        <Button
          className={styles.me__button}
          navigate={PAGES.SETTINGS}
          color='outlined'
        >
          ред. профиль
        </Button>
      </section>
    )
  },
  () => <ErrorSection name='профиль' />
)

export default Me
