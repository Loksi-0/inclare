'use client'

import Misted from '@/shared/ui/Misted'
import Button from '@/shared/ui/Button'
import cx from 'clsx'
import { useTRPC } from '@/shared/api/tanstack'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { DEFAULTS } from '@/constants'
import styles from './Error.module.scss'

type ErrorProps = {
  error: Error
}

const Error = ({ error }: ErrorProps) => {
  const { replace } = useNavigate()
  const trpc = useTRPC()
  const { mutate: logout } = useMutation(
    trpc.auth.logoutAll.mutationOptions({
      onSuccess: () => {
        replace(DEFAULTS.START_PAGE)
      }
    })
  )
  const { data: isBanned } = useQuery(trpc.user.checkMeIsBanned.queryOptions())

  return (
    <div className={styles.error}>
      <div className={styles.error__inner}>
        <h1 className={cx(styles.error__title, 'mono')}>{':('}</h1>
        <p className={cx(styles.error__message, 'mono')}>
          {isBanned
            ? 'Ваш аккаунт заблокирован на неопределенный срок'
            : 'Произошла ошибка при загрузке страницы'}
        </p>
        {isBanned ? (
          <Button
            color='solid'
            onClick={() => {
              logout()
            }}
          >
            выйти из аккаунта
          </Button>
        ) : (
          <Button
            color='solid'
            onClick={() => {
              window.location.reload()
            }}
          >
            обновить страницу
          </Button>
        )}
        <Misted className={cx(styles.error__code, 'mono', 'subtitle')}>
          {error.message}
        </Misted>
      </div>
    </div>
  )
}

export default Error
