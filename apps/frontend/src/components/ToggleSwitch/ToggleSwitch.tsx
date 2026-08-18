'use client'

import { useEffect, useState } from 'react'
import Button from '../Button'
import cx from 'clsx'
import styles from './ToggleSwitch.module.scss'

type ToggleSwitchProps = {
  title: string
  isToggled: boolean
  onToggle: (isToggled: boolean) => void | Promise<void>
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
  const { title, isToggled: initialIsToggled, onToggle } = props

  const [isToggled, setIsToggled] = useState(initialIsToggled)

  useEffect(() => {
    setIsToggled(initialIsToggled)
  }, [initialIsToggled])

  const onClick = () => {
    setIsToggled(!initialIsToggled)
    onToggle(!initialIsToggled)
  }

  return (
    <div className={styles.toggle}>
      <p>{title}</p>
      <Button
        color='icon'
        className={styles.toggle__button}
        onClick={onClick}
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

export default ToggleSwitch
