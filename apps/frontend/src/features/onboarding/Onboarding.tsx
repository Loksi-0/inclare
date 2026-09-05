'use client'

import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Button from '@/shared/ui/Button'
import { onboardingStore } from './onboarding.store'

import styles from './Onboarding.module.scss'
import { randomInt } from 'node:crypto'
import { useAppearMotion } from '@/shared/hooks/useAppear.motion'

const Onboarding = observer(() => {
  const BUTTON_TEXTS = ['ясно', 'ясно понятно', 'хорошо']

  const [buttonText, setButtonText] = useState('ясно')
  const popupRef = useRef<HTMLDivElement | null>(null)

  useAppearMotion({ ref: popupRef, state: onboardingStore.isOpen })

  useEffect(() => {
    if (onboardingStore.isOpen) {
      setButtonText(
        BUTTON_TEXTS.at(randomInt(0, BUTTON_TEXTS.length - 1)) || 'ясно'
      )
    }
  }, [onboardingStore.isOpen])

  return (
    <div
      ref={popupRef}
      className={styles.onboarding}
    >
      <div className={styles.onboarding__body}>
        <h3>{onboardingStore.title}</h3>
        <p>{onboardingStore.description}</p>
      </div>
      <Button
        color='solid'
        onClick={() => {
          onboardingStore.close()
        }}
      >
        {buttonText}
      </Button>
    </div>
  )
})

export default Onboarding
