'use client'

import { observer } from 'mobx-react-lite'
import Button from '../Button'
import { useEffect, useRef, useState } from 'react'
import { onboardingStore } from '@/stores/onboarding.store'
import { useBlur } from '@/shared/hooks/useBlur'
import gsap from 'gsap'
import { soundStore } from '@/stores/sound.store'
import { randomInt } from '@/shared/functions/randomInt'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import styles from './Onboarding.module.scss'

const Onboarding = observer(() => {
  const BUTTON_TEXTS = ['ясно', 'ясно понятно', 'хорошо']

  const { isMounted } = useIsMounted()
  const [buttonText, setButtonText] = useState('ясно')

  const popupRef = useRef<HTMLDivElement | null>(null)
  const blurOut = useBlur({ from: 5, to: 0 })
  const blurIn = useBlur({ from: 0, to: 5 })

  useEffect(() => {
    if (!isMounted) {
      return
    }

    if (onboardingStore.isOpen) {
      soundStore.playPopup()
      setButtonText(
        BUTTON_TEXTS.at(randomInt(0, BUTTON_TEXTS.length - 1)) || 'ясно'
      )

      blurOut(popupRef.current)
      gsap.fromTo(
        popupRef.current,
        { display: 'flex', opacity: 0 },
        {
          opacity: 1,
          duration: 0.2
        }
      )
    } else {
      blurIn(popupRef.current)
      gsap.to(popupRef.current, {
        opacity: 0,
        display: 'none',
        duration: 0.2
      })
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
