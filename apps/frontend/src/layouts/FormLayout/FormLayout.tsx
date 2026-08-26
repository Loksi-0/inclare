import { forwardRef, type PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './FormLayout.module.scss'

const FormLayout = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <main
        ref={ref}
        className={cx(styles.form, 'container-form')}
      >
        <div className={styles.form__inner}>{children}</div>
      </main>
    )
  }
)

export default FormLayout
