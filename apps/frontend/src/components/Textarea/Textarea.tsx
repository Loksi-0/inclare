import { forwardRef, useId, type ChangeEvent } from 'react'
import styles from './Textarea.module.scss'
import cx from 'clsx'
import useAutoAnimate from '@/shared/hooks/useAutoAnimate'

type TextareaProps = {
  label?: string
  placeholder: string
  error?: string
  required?: boolean
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => void
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      label,
      placeholder,
      error,
      required = false,
      onChange,
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
        />
        {error && <p className={styles.textarea__error}>{error}</p>}
      </div>
    )
  }
)

export default Textarea
