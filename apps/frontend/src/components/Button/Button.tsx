'use client'

import type { MouseEventHandler, PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './Button.module.scss'
import { useRouter } from 'next/navigation'
import Preloader from '../Preloader'
import { useNavigate } from '@/shared/hooks/useNavigate'

type ButtonProps = PropsWithChildren<{
  color: 'solid' | 'outlined' | 'underline' | 'underline-gray' | 'icon'
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
  const { push } = useNavigate()

  const onClickAction = navigate
    ? () => {
        if (navigate === 'back') {
          router.back()
        } else {
          push(navigate)
        }
      }
    : onClick

  return (
    <button
      className={cx(styles.button, styles[color], className, [
        { [styles.disabled]: disabled },
        { [styles.gray]: color === 'underline-gray' },
        { [styles.underline]: color === 'underline-gray' }
      ])}
      disabled={disabled}
      onClick={onClickAction}
      type={type}
      data-cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      {loading ? (
        <Preloader color={color === 'solid' ? 'light' : 'dark'} />
      ) : (
        children
      )}
    </button>
  )
}

export default Button
