'use client'

import type { MouseEventHandler, PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './Button.module.scss'
import { useRouter } from 'next/navigation'
import Preloader from '../Preloader'

type ButtonProps = PropsWithChildren<{
  color: 'solid' | 'outlined' | 'icon'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  navigate?: string
  loading?: boolean
}>

const Button = (props: ButtonProps) => {
  const {
    color,
    disabled = false,
    loading = false,
    className,
    onClick,
    children,
    navigate,
    type = 'button'
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
      type={type}
    >
      {loading ? <Preloader color='light' /> : children}
    </button>
  )
}

export default Button
