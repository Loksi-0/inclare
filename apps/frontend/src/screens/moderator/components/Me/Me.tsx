'use client'

import Avatar from '@/features/avatar'
import cx from 'clsx'
import { PAGES } from '@/constants'
import Button from '@/shared/ui/Button'
import styles from './Me.module.scss'

type MeProps = {
  avatar: string | null
  name: string
  role: string
}

const Me = ({ avatar, name, role }: MeProps) => {
  return (
    <section className={styles.me}>
      <div className={styles.me__body}>
        <Avatar
          className={styles.me__avatar}
          src={avatar}
          width={120}
          height={120}
        />
        <h1>{name}</h1>
        <p className={cx(styles.me__role, 'mono', 'subtitle')}>{role}</p>
      </div>
      <div className={styles.me__buttons}>
        <Button
          navigate={PAGES.PROFILE}
          color='solid'
        >
          перейти в профиль
        </Button>
      </div>
    </section>
  )
}

export default Me
