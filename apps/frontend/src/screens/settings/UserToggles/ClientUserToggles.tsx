'use client'

import ToggleSwitch from '@/shared/ui/Switch'
import { useEffect, useState } from 'react'
import { useTRPC } from '@/shared/api/tanstack'
import { useMutation } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { soundStore } from '@/shared/stores/sound.store'
import styles from './UserToggles.module.scss'
import { preferencesStore } from '@/shared/stores/preferences.store'
import { isTouchscreen } from '@/shared/functions/isTouchscreen'
import { useIsMounted } from '@/shared/hooks/useIsMounted'

type UserTogglesProps = {
  isPrivate: boolean
}

const ClientUserToggles = observer(
  ({ isPrivate: initialIsPrivate }: UserTogglesProps) => {
    const { isMounted } = useIsMounted()
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
          isToggled={soundStore.isOn}
          onToggle={(t) => {
            soundStore.setIsOn(t)
          }}
        />
        {!isTouchscreen && isMounted && (
          <ToggleSwitch
            title='Кастомный курсор'
            isToggled={preferencesStore.showCursor}
            onToggle={(t) => {
              preferencesStore.setShowCursor(t)
            }}
          />
        )}
        <ToggleSwitch
          title='Жесты'
          isToggled={preferencesStore.enableGestures}
          onToggle={(t) => {
            preferencesStore.setEnableGestures(t)
          }}
        />
        <ToggleSwitch
          title='Темная тема'
          isToggled={preferencesStore.darkTheme}
          onToggle={(t) => {
            preferencesStore.setDarkTheme(t)
          }}
        />
      </div>
    )
  }
)

export default ClientUserToggles
