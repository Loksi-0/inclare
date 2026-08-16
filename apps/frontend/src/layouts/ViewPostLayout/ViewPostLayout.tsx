import type { PropsWithChildren } from 'react'
import styles from './ViewPostLayout.module.scss'

type ViewPostLayoutProps = PropsWithChildren<{
  height: number
  zIndex?: number
}>

const ViewPostLayout = (props: ViewPostLayoutProps) => {
  const { height, children, zIndex } = props

  return (
    <section
      className={styles.post}
      style={{
        height: `${height}px`,
        zIndex
      }}
    >
      <div className={styles.post__inner}>{children}</div>
    </section>
  )
}

export default ViewPostLayout
