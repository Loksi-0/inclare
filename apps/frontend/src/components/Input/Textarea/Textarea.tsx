import { forwardRef, useId, type ChangeEvent } from 'react'
import cx from 'clsx'
import { useAutoAnimate } from '@/shared/hooks/useAutoAnimate'
import styles from './Textarea.module.scss'

type TextareaProps = {
  label?: string
  placeholder: string
  error?: string
  required?: boolean
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      label,
      placeholder,
      error,
      required = false,
      onChange,
      value,
      ...rest
    } = props

    const id = useId()
    const inputRef = useAutoAnimate([error], { width: false })

    return (
      <div
        className={styles.textarea}
        ref={inputRef}
      >
        {label && (
          <label
            className={cx(styles.textarea__label, [
              { [styles.required]: required }
            ])}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <textarea
          {...rest}
          ref={ref}
          id={id}
          className={cx(styles.textarea__textarea, [
            { [styles.invalid]: error }
          ])}
          placeholder={placeholder}
          onChange={(e) => {
            onChange?.(e)
          }}
          value={value}
        />
        {error && <p className={styles.textarea__error}>{error}</p>}
      </div>
    )
  }
)

export default Textarea
