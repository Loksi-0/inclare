'use client'

import { useTRPC } from '@/api/tanstack'
import OptionsButton from '@/components/OptionsButton'
import { useMutation } from '@tanstack/react-query'
import { DEFAULTS } from '@/constants'
import { useNavigate } from '@/shared/hooks/useNavigate'

const UserActions = () => {
  const { push } = useNavigate()
  const trpc = useTRPC()
  const { mutate: logoutCurrent, isPending: isCurrentPending } = useMutation(
    trpc.auth.logoutCurrentDevice.mutationOptions()
  )
  const { mutate: logoutAll, isPending: isAllPending } = useMutation(
    trpc.auth.logoutAll.mutationOptions()
  )

  return (
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
  )
}

export default UserActions
