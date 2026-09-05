'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Button from '../../ui/Button'
import cx from 'clsx'
import styles from './Tabs.module.scss'
import { useSwipe } from '@/shared/hooks/useSwipe'

type TabsProps = {
  data: {
    title: string
    content: ReactNode
  }[]
  className?: string
  maxWidth?: number
}

const Tabs = (props: TabsProps) => {
  const { data, className, maxWidth } = props

  const tabsLength = useMemo(() => data.length, [data])
  const [currentTab, setCurrentTab] = useState(0)

  useSwipe({
    strength: 'medium',
    onLeftToRight: () => {
      setCurrentTab((prev) => {
        const nextTab = prev - 1

        if (nextTab < 0) {
          return prev
        }

        return nextTab
      })
    },
    onRightToLeft: () => {
      setCurrentTab((prev) => {
        const nextTab = prev + 1

        if (nextTab > tabsLength - 1) {
          return prev
        }

        return nextTab
      })
    }
  })

  return (
    <div className={cx(styles.tabs, className)}>
      <header
        className={styles.tabs__header}
        style={{
          maxWidth
        }}
      >
        {data.map((d, i) => (
          <Button
            className={cx(styles.tabs__button, [
              { [styles.selected]: currentTab === i }
            ])}
            key={`${d.title}-${i}`}
            color='icon'
            onClick={() => {
              setCurrentTab(i)
            }}
          >
            {d.title}
          </Button>
        ))}
      </header>
      {data.at(currentTab)?.content}
    </div>
  )
}

export default Tabs
