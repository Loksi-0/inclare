import { forwardRef, type PropsWithChildren } from 'react'
import styles from './FormLayout.module.scss'
import cx from 'clsx'

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
