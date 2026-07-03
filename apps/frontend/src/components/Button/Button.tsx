'use client'

import type { MouseEventHandler, PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './Button.module.scss'
import { useRouter } from 'next/navigation'

type ButtonProps = PropsWithChildren<{
  color: 'solid' | 'outlined'
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  navigate?: string
}>

const Button = (props: ButtonProps) => {
  const {
    color,
    disabled = false,
    className,
    onClick,
    children,
    navigate
  } = props

  const router = useRouter()

  const onClickAction = navigate
    ? () => {
        if (navigate === 'back') {
          router.back()
        } else {
          router.push(navigate)
        }
      }
    : onClick

  return (
    <button
      className={cx(styles.button, styles[color], className, [
        { [styles.disabled]: disabled }
      ])}
      disabled={disabled}
      onClick={onClickAction}
    >
      {children}
    </button>
  )
}

export default Button
