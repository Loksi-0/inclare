import Header from '@/components/Header'
import { type PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './PageLayout.module.scss'

type PageLayoutProps = PropsWithChildren<{
  profile?: boolean
  padding?: boolean
  plane?: boolean
  settings?: boolean
  className?: string
  overflow?: boolean
}>

const PageLayout = (props: PageLayoutProps) => {
  const {
    children,
    className,
    settings = false,
    profile = false,
    padding = false,
    plane = false,
    overflow = false
  } = props

  return (
    <div className={cx(styles.layout, [{ [styles.plane]: plane }])}>
      <Header />
      <main
        className={cx(styles.layout__main, className, [
          { [styles.profile]: profile },
          { [styles.padding]: padding },
          { [styles.overflow]: overflow },
          { [styles.plane]: plane },
          { [styles.settings]: settings }
        ])}
      >
        {children}
      </main>
    </div>
  )
}

export default PageLayout
