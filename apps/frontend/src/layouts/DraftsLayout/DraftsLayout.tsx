import Button from '@/components/Button'
import styles from './DraftsLayout.module.scss'
import { PAGES } from '@/constants'
import type { PropsWithChildren } from 'react'

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
