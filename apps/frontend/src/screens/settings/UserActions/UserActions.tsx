'use client'

import { useTRPC } from '@/shared/api/tanstack'
import OptionsButton from '@/shared/ui/OptionsButton'
import { useMutation } from '@tanstack/react-query'
import { DEFAULTS } from '@/constants'
import { useNavigate } from '@/shared/hooks/useNavigate'
import styles from './UserActions.module.scss'
import ConfirmButton from '@/shared/ui/ConfirmButton'

const UserActions = () => {
  const { push } = useNavigate()
  const trpc = useTRPC()
  const { mutate: logoutCurrent, isPending: isCurrentPending } = useMutation(
    trpc.auth.logoutCurrentDevice.mutationOptions()
  )
  const { mutate: logoutAll, isPending: isAllPending } = useMutation(
    trpc.auth.logoutAll.mutationOptions()
  )
  const { mutate: deleteMe, isPending: isDeletePending } = useMutation(
    trpc.user.deleteMe.mutationOptions()
  )

  return (
    <div className={styles.actions}>
      <OptionsButton
        color='outlined'
        data={[
          {
            title: 'Выйти на этом устройстве',
            onClick: (close) => {
              logoutCurrent(undefined, {
                onSuccess: () => {
                  close()
                  push(DEFAULTS.START_PAGE)
                }
              })
            },
            color: 'solid',
            loading: isCurrentPending
          },
          {
            title: 'Выйти на всех устройствах',
            onClick: (close) => {
              logoutAll(undefined, {
                onSuccess: () => {
                  close()
                  push(DEFAULTS.START_PAGE)
                }
              })
            },
            color: 'outlined',
            loading: isAllPending
          }
        ]}
      >
        выйти из аккаунта
      </OptionsButton>
      <ConfirmButton
        color='outlined'
        content={{
          title: 'Удалить аккаунт?',
          description: 'Восстановить аккаунт уже будет нельзя',
          confirm: 'удалить',
          reject: 'отмена'
        }}
        onConfirm={(close) => {
          deleteMe(undefined, {
            onSuccess: () => {
              close()
              push(DEFAULTS.START_PAGE)
            }
          })
        }}
        loading={isDeletePending}
      >
        удалить аккаунт
      </ConfirmButton>
    </div>
  )
}

export default UserActions
