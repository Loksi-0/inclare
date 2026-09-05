'use client'

import { useEffect, useState } from 'react'
import Button from '../Button'
import cx from 'clsx'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import styles from './Switch.module.scss'
import { CURSOR } from '@/constants'

type SwitchProps = {
  title: string
  isToggled: boolean
  onToggle: (isToggled: boolean) => void | Promise<void>
}

const Switch = (props: SwitchProps) => {
  const { title, isToggled: initialIsToggled, onToggle } = props

  const { isMounted } = useIsMounted()
  const [isToggled, setIsToggled] = useState(
    isMounted ? initialIsToggled : false
  )

  useEffect(() => {
    setIsToggled(initialIsToggled)
  }, [initialIsToggled])

  const onClick = () => {
    setIsToggled(!initialIsToggled)
    onToggle(!initialIsToggled)
  }

  return (
    <div
      onClick={onClick}
      className={styles.toggle}
      data-cursor={CURSOR.POINTER}
    >
      <p>{title}</p>
      <Button
        color='icon'
        className={styles.toggle__button}
      >
        <div
          className={cx(styles.toggle__switch, [
            { [styles.toggled]: isToggled }
          ])}
        ></div>
      </Button>
    </div>
  )
}

export default Switch
