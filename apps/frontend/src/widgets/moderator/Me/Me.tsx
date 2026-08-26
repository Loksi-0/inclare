'use client'

import Avatar from '@/components/Avatar'
import OptionsButton from '@/components/OptionsButton'
import cx from 'clsx'
import { useTRPC } from '@/api/tanstack'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { DEFAULTS, PAGES } from '@/constants'
import Button from '@/components/Button'
import styles from './Me.module.scss'

type MeProps = {
  avatar: string | null
  name: string
  role: string
}

const Me = ({ avatar, name, role }: MeProps) => {
  const { replace } = useNavigate()

  const trpc = useTRPC()
  const { mutate: logoutCurrent, isPending: isCurrentPending } = useMutation(
    trpc.auth.logoutCurrentDevice.mutationOptions({
      onSuccess: () => {
        replace(DEFAULTS.START_PAGE)
      }
    })
  )
  const { mutate: logoutAll, isPending: isAllPending } = useMutation(
    trpc.auth.logoutAll.mutationOptions({
      onSuccess: () => {
        replace(DEFAULTS.START_PAGE)
      }
    })
  )

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
          color='outlined'
          navigate={PAGES.SETTINGS}
        >
          настройки
        </Button>
        <OptionsButton
          color='solid'
          data={[
            {
              title: 'выйти на этом устройстве',
              color: 'solid',
              onClick: () => {
                logoutCurrent()
              },
              loading: isCurrentPending
            },
            {
              title: 'выйти на всех устройствах',
              color: 'outlined',
              onClick: () => {
                logoutAll()
              },
              loading: isAllPending
            }
          ]}
        >
          выйти из аккаунта
        </OptionsButton>
      </div>
    </section>
  )
}

export default Me
