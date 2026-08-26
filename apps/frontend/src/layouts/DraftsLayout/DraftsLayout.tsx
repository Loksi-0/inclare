import Button from '@/components/Button'
import { PAGES } from '@/constants'
import type { PropsWithChildren } from 'react'
import styles from './DraftsLayout.module.scss'

const DraftsLayout = ({ children }: PropsWithChildren) => {
  return (
    <section className={styles.drafts}>
      <header className={styles.drafts__header}>
        <Button
          color='underline'
          navigate={PAGES.PROFILE}
        >
          {'<-'} назад
        </Button>
      </header>
      {children}
    </section>
  )
}

export default DraftsLayout
