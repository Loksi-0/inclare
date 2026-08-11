'use client'

import type { MouseEventHandler, PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './Button.module.scss'
import { useRouter } from 'next/navigation'
import Preloader from '../Preloader'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { CURSOR } from '@/constants'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'

type ButtonProps = PropsWithChildren<{
  color: 'solid' | 'outlined' | 'underline' | 'underline-gray' | 'icon' | 'none'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  navigate?: string
  loading?: boolean
  animate?: boolean
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
    type = 'button',
    animate = false
  } = props

  const router = useRouter()
  const { push } = useNavigate()
  const buttonRef = useAutoAnimate<HTMLButtonElement>([loading, children])

  if (navigate) {
    return (
      <a
        href={navigate}
        className={cx(styles.button, styles[color], className, [
          { [styles.disabled]: disabled },
          { [styles.gray]: color === 'underline-gray' },
          { [styles.underline]: color === 'underline-gray' }
        ])}
        data-cursor={disabled ? CURSOR.NOT_ALLOWED : CURSOR.POINTER}
        onClick={(e) => {
          e.preventDefault()

          if (navigate === 'back') {
            router.back()
          } else {
            push(navigate)
          }
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={animate ? buttonRef : undefined}
      className={cx(styles.button, styles[color], className, [
        { [styles.disabled]: disabled },
        { [styles.gray]: color === 'underline-gray' },
        { [styles.underline]: color === 'underline-gray' }
      ])}
      disabled={disabled}
      onClick={onClick}
      type={type}
      data-cursor={disabled ? CURSOR.NOT_ALLOWED : CURSOR.POINTER}
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
