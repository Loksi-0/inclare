'use client'

import {
  forwardRef,
  type CSSProperties,
  type MouseEventHandler,
  type PropsWithChildren
} from 'react'
import cx from 'clsx'
import styles from './Button.module.scss'
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
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  navigate?: string
  loading?: boolean
  animate?: boolean
  tabindex?: number
  style?: CSSProperties
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
    tabindex,
    style
  } = props

  const { push, back } = useNavigate()
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
        style={style}
        onClick={(e) => {
          e.preventDefault()
          onClick?.(e)

          if (navigate === 'back') {
            back()
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
      style={style}
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
