'use client'

import { forwardRef, useId, useState, type ChangeEvent } from 'react'
import Button from '@/shared/ui/Button'
import EyeOpen from '@/shared/icons/EyeOpen'
import EyeClosed from '@/shared/icons/EyeClosed'
import cx from 'clsx'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'
import styles from './Password.module.scss'

type PasswordInputProps = {
  placeholder: string
  label?: string
  error?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const { placeholder, label, error, onChange, ...rest } = props

    const id = useId()
    const inputRef = useAutoAnimate([error], { width: false })
    const [isShown, setIsShown] = useState(false)
    const toggleShow = () => {
      setIsShown((prev) => !prev)
    }

    return (
      <div
        className={styles.passwordInput}
        ref={inputRef}
      >
        {label && (
          <label
            className={styles.passwordInput__label}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className={styles.passwordInput__body}>
          <input
            type={isShown ? 'text' : 'password'}
            className={cx(styles.passwordInput__input, [
              { [styles.invalid]: error }
            ])}
            id={id}
            placeholder={placeholder}
            inputMode='text'
            ref={ref}
            {...rest}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\s/g, '')

              onChange?.(e)
            }}
          />
          <Button
            className={styles.passwordInput__button}
            color='icon'
            onClick={toggleShow}
          >
            {isShown ? <EyeClosed /> : <EyeOpen />}
          </Button>
        </div>
        {error && <p className={styles.passwordInput__error}>{error}</p>}
      </div>
    )
  }
)

export default PasswordInput
