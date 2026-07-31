import Header from '@/components/Header'
import type { PropsWithChildren } from 'react'
import cx from 'clsx'
import styles from './PageLayout.module.scss'

type PageLayoutProps = PropsWithChildren<{
  profile?: boolean
}>

const PageLayout = (props: PageLayoutProps) => {
  const { children, profile = false } = props

  return (
    <>
      <Header />
      <main
        className={cx(styles.layout, [{ [styles.profile]: profile }])}
      >
        {children}
      </main>
    </>
  )
}

export default PageLayout
