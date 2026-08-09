'use client'

import { postStore } from '@/stores/post.store'
import styles from './ViewPost.module.scss'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import ViewPostSkeleton from './ViewPostSkeleton'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import Button from '../Button'
import Photo from '../Photo'
import Like from '../Like'
import { dateToString } from '@/shared/functions/dateToString'

const ViewPost = observer(() => {
  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.post.getOne.queryOptions(
      { id: String(postStore.postId) },
      { enabled: !!postStore.postId }
    )
  )

  if (!data) {
    return <ViewPostSkeleton />
  }

  return (
    <section className={styles.post}>
      <div className={styles.post__inner}>
        <div className={styles.post__top}>
          <header className={styles.post__header}>
            <div className='mono subtitle'>
              {data.isMy ? 'me' : data.author.name} /{' '}
              {dateToMonth(data.createdAt)} {data.createdAt.getDate()}
            </div>
            <Button
              color='underline'
              onClick={() => {
                postStore.close()
              }}
            >
              назад ↑
            </Button>
          </header>
          {data.description && (
            <div className={styles.post__description}>{data.description}</div>
          )}
          <div className={styles.post__photos}>
            {data.photos.map((p) => (
              <div key={p.id}>
                <Photo
                  className={styles.post__photo}
                  src={p.optimizedUrl}
                  mini
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.post__bottom}>
          <Like
            postId={data.id}
            color={data.primaryColor || '#DD2E2E'}
            likes={data.likesCount}
            isLiked={data.isLiked}
          />
          <div className={styles.post__buttons}>
            <Button color='solid'>скачать исходники</Button>
            {data.isMy && <Button color='outlined'>удалить пачку</Button>}
          </div>
          <div className={styles.post__info}>
            <p className='subtitle mono'>
              created_at {dateToString(data.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
})

export default ViewPost
