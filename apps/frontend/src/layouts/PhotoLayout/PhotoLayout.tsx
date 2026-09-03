import { forwardRef, type CSSProperties, type PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './PhotoLayout.module.scss'

type PhotoLayoutProps = PropsWithChildren<{
  mini?: boolean
  vertical?: boolean
  className?: string
  style?: CSSProperties
}>

const PhotoLayout = forwardRef<HTMLDivElement, PhotoLayoutProps>(
  (props, ref) => {
    const { children, mini = false, vertical = false, className, style } = props

    return (
      <div
        ref={ref}
        className={cx(styles.photo, className, [
          { [styles.mini]: mini, [styles.vertical]: vertical }
        ])}
        style={style}
      >
        <div className={styles.photo__inner}>{children}</div>
      </div>
    )
  }
)

export default PhotoLayout
