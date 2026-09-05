'use client'

import { forwardRef, useId, type ChangeEvent } from 'react'
import cx from 'clsx'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'
import type { InputMode } from '@/shared/types/globals'
import styles from './Text.module.scss'

type TextInputProps = {
  placeholder: string
  label?: string
  error?: string
  inputMode?: InputMode
  preventSpaces?: boolean
  required?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    placeholder,
    label,
    error,
    inputMode = 'text',
    preventSpaces = false,
    onChange,
    required = false,
    ...rest
  } = props
  const id = useId()
  const inputRef = useAutoAnimate([error], { width: false })

  return (
    <div
      className={styles.input}
      ref={inputRef}
    >
      {label && (
        <label
          className={cx(styles.input__label, [{ [styles.required]: required }])}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        className={cx(styles.input__input, [{ [styles.invalid]: error }])}
        id={id}
        placeholder={placeholder}
        ref={ref}
        inputMode={inputMode}
        onChange={(e) => {
          if (preventSpaces) {
            e.target.value = e.target.value.replace(/\s/g, '')
          }

          onChange?.(e)
        }}
      />
      {error && <p className={styles.input__error}>{error}</p>}
    </div>
  )
})

export default TextInput
