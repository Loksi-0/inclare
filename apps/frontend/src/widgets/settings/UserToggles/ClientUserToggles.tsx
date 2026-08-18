'use client'

import ToggleSwitch from '@/components/ToggleSwitch'
import styles from './UserToggles.module.scss'
import { useState } from 'react'
import type { api } from '@/api/trpc'
import { useTRPC } from '@/api/tanstack'
import { useMutation } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { preferencesStore } from '@/stores/preferences.store'

type UserTogglesProps = {
  isPrivate: boolean
}

const ClientUserToggles = observer(
  ({ isPrivate: initialIsPrivate }: UserTogglesProps) => {
    const [isPrivate, setIsPrivate] = useState(initialIsPrivate)

    const trpc = useTRPC()
    const { mutate: toggleIsPrivate } = useMutation(
      trpc.user.toggleIsPrivate.mutationOptions()
    )

    return (
      <div className={styles.toggles}>
        <ToggleSwitch
          title='Приватный профиль'
          isToggled={isPrivate}
          onToggle={() => {
            toggleIsPrivate(undefined, {
              onSuccess: (u) => {
                setIsPrivate(u.isPrivate)
              }
            })
          }}
        />
        <ToggleSwitch
          title='Звуковые эффекты'
          isToggled={preferencesStore.enableSoundEffects}
          onToggle={(t) => {
            preferencesStore.setSoundEffects(t)
          }}
        />
      </div>
    )
  }
)

export default ClientUserToggles
