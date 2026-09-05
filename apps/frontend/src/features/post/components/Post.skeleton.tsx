'use client'

import { postStore } from '../post.store'
import Button from '@/shared/ui/Button'
import Skeleton from '@/shared/ui/Skeleton'
import styles from './PostSkeleton.module.scss'

const PostSkeleton = ({ height }: { height: number }) => {
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

export default PostSkeleton
