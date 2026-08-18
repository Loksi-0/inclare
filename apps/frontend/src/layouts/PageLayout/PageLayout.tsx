import Header from '@/components/Header'
import type { PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './PageLayout.module.scss'

type PageLayoutProps = PropsWithChildren<{
  profile?: boolean
  settings?: boolean
  className?: string
}>

const PageLayout = (props: PageLayoutProps) => {
  const { children, className, settings = false, profile = false } = props

  return (
    <>
      <Header />
      <main
        className={cx(styles.layout, className, [
          { [styles.profile]: profile },
          { [styles.settings]: settings }
        ])}
      >
        {children}
      </main>
    </>
  )
}

export default PageLayout
