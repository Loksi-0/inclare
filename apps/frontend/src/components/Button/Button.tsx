'use client'

import {
  forwardRef,
  type MouseEventHandler,
  type PropsWithChildren
} from 'react'
import cx from 'clsx'
import styles from './Button.module.scss'
import { useRouter } from 'next/navigation'
import Preloader from '../Preloader'
import { useNavigate } from '@/shared/hooks/useNavigate'
import { CURSOR } from '@/constants'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'
import mergeRefs from 'merge-refs'

type ButtonProps = PropsWithChildren<{
  color: 'solid' | 'outlined' | 'underline' | 'underline-gray' | 'icon' | 'none'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  navigate?: string
  loading?: boolean
  animate?: boolean
  tabindex?: number
}>

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    color,
    disabled = false,
    loading = false,
    className,
    onClick,
    children,
    navigate,
    type = 'button',
    animate = false,
    tabindex
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
      ref={animate ? mergeRefs(buttonRef, ref) : ref}
      className={cx(styles.button, styles[color], className, [
        { [styles.disabled]: disabled },
        { [styles.gray]: color === 'underline-gray' },
        { [styles.underline]: color === 'underline-gray' }
      ])}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      data-cursor={disabled ? CURSOR.NOT_ALLOWED : CURSOR.POINTER}
      tabIndex={tabindex}
    >
      {loading ? (
        <Preloader color={color === 'solid' ? 'light' : 'dark'} />
      ) : (
        children
      )}
    </button>
  )
})

export default Button
