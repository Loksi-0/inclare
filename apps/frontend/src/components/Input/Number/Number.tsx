import cx from 'clsx'
import { Controller } from 'react-hook-form'
import { useNumber } from './useNumber'
import styles from './Number.module.scss'

type NumberInputProps = {
  placeholder: string
  label: string
  measure: string
  name: string
  error?: string
  required?: boolean
  maxWidth?: number
  min?: number
  max?: number
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
    min,
    max,
    ...rest
  } = props

  const { inputRef, id, control, onChange } = useNumber({ min, max, error })

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
          render={({
            field: { onChange: setValue, value, ref: controllerRef }
          }) => (
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
                onChange(e, setValue)
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
