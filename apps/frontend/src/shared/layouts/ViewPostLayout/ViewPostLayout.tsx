import { useEffect, type PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'
import { useViewPostLayout } from './useViewPostLayout'
import styles from './ViewPostLayout.module.scss'

type ViewPostLayoutProps = PropsWithChildren<{
  height: number
  zIndex?: number
}>

const ViewPostLayout = observer((props: ViewPostLayoutProps) => {
  const { height, children, zIndex } = props

  const { innerRef } = useViewPostLayout()

  return (
    <section
      className={styles.post}
      style={{
        height: `${height}px`,
        zIndex
      }}
    >
      <div
        ref={innerRef}
        className={styles.post__inner}
      >
        {children}
      </div>
    </section>
  )
})

export default ViewPostLayout
