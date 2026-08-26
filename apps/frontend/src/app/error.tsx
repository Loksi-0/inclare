'use client'

import Misted from '@/components/Misted'
import { ERROR_CODES } from '@repo/api-error-codes'
import styles from './Error.module.scss'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import cx from 'clsx'
import { useTRPC } from '@/api/tanstack'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { DEFAULTS } from '@/constants'

type ErrorProps = {
  error: Error
}

const Error = ({ error }: ErrorProps) => {
  const router = useRouter()
  const { replace } = useNavigate()
  const trpc = useTRPC()
  const { mutate: logout } = useMutation(
    trpc.auth.logoutAll.mutationOptions({
      onSuccess: () => {
        replace(DEFAULTS.START_PAGE)
      }
    })
  )

  const isBanned = error.message === ERROR_CODES.REQUEST.FORBIDDEN.code

  return (
    <div className={styles.error}>
      <div className={styles.error__inner}>
        <h1 className={cx(styles.error__title, 'mono')}>{':('}</h1>
        <p className={cx(styles.error__message, 'mono')}>
          {isBanned
            ? 'Ваш аккаунт заблокирован на неопределенный срок'
            : 'Произошла ошибка при загрузке страницы'}
        </p>
        {!isBanned ? (
          <Button
            color='solid'
            onClick={() => {
              router.refresh()
            }}
          >
            обновить страницу
          </Button>
        ) : (
          <Button
            color='solid'
            onClick={() => {
              logout()
            }}
          >
            выйти из аккаунта
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
