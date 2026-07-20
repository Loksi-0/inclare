import { useId } from 'react'
import styles from './NumberInput.module.scss'
import cx from 'clsx'
import { Controller, useFormContext } from 'react-hook-form'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'

type NumberInputProps = {
  placeholder: string
  label: string
  measure: string
  name: string
  error?: string
  required?: boolean
  maxWidth?: number
  max?: number
  min?: number
}

const NumberInput = (props: NumberInputProps) => {
  const {
    placeholder,
    label,
    measure,
    error,
    name,
    required = false,
    maxWidth,
    max,
    min,
    ...rest
  } = props
  const id = useId()
  const inputRef = useAutoAnimate([error], { width: false })
  const { control } = useFormContext()

  return (
    <div
      className={styles.numberInput}
      ref={inputRef}
    >
      <label
        className={cx(styles.numberInput__label, [
          { [styles.required]: required }
        ])}
        htmlFor={id}
      >
        {label}
      </label>
      <div className={styles.numberInput__body}>
        <Controller<Record<string, number>, string>
          name={name}
          control={control}
          render={({ field: { onChange, value, ref: controllerRef } }) => (
            <input
              {...rest}
              id={id}
              ref={controllerRef}
              value={value || ''}
              className={cx(styles.numberInput__input, {
                [styles.invalid]: error
              })}
              placeholder={placeholder}
              inputMode='numeric'
              type='number'
              onChange={(e) => {
                const val = e.target.value

                if (!/^-?\d*$/.test(val)) {
                  return
                }

                const intVal = Number(val)
                if (
                  (typeof max === 'number' && intVal > max) ||
                  (typeof min === 'number' && intVal < min)
                ) {
                  return
                }

                onChange(intVal)
              }}
              style={maxWidth ? { maxWidth } : undefined}
            />
          )}
        />
        <p>{measure}</p>
      </div>
      {error && <p className={styles.numberInput__error}>{error}</p>}
    </div>
  )
}

export default NumberInput
