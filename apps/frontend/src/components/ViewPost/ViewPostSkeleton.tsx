'use client'

import { postStore } from '@/stores/post.store'
import Button from '../Button'
import Skeleton from '../Skeleton'
import styles from './ViewPost.module.scss'

const ViewPostSkeleton = ({ height }: { height: number }) => {
  return (
    <section
      className={styles.skeleton}
      style={{
        height: `${height}px`
      }}
    >
      <div className={styles.skeleton__inner}>
        <header className={styles.skeleton__header}>
          <Skeleton
            width={120}
            height={25}
          />
          <Button
            color='underline'
            onClick={() => {
              postStore.close()
            }}
          >
            назад ↑
          </Button>
        </header>
        <Skeleton
          width='100%'
          height={60}
        />
        <div className={styles.skeleton__photos}>
          <Skeleton className={styles.skeleton__photo} />
          <Skeleton className={styles.skeleton__photo} />
          <Skeleton className={styles.skeleton__photo} />
          <Skeleton className={styles.skeleton__photo} />
        </div>
        <div className={styles.skeleton__buttons}>
          <Skeleton
            width={150}
            height={50}
          />
          <Skeleton
            width={150}
            height={50}
          />
        </div>
        <Skeleton
          width={250}
          height={25}
        />
      </div>
    </section>
  )
}

export default ViewPostSkeleton
