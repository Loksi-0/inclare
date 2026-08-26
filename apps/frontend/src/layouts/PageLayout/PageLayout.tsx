import Header from '@/components/Header'
import type { PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './PageLayout.module.scss'

type PageLayoutProps = PropsWithChildren<{
  profile?: boolean
  padding?: boolean
  plane?: boolean
  settings?: boolean
  className?: string
}>

const PageLayout = (props: PageLayoutProps) => {
  const {
    children,
    className,
    settings = false,
    profile = false,
    padding = false,
    plane = false
  } = props

  return (
    <div className={cx(styles.layout, [{ [styles.plane]: plane }])}>
      <Header />
      <main
        className={cx(styles.layout__main, className, [
          { [styles.profile]: profile },
          { [styles.padding]: padding },
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
