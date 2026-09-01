'use client'

import { postStore } from '@/stores/post.store'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import ViewPostSkeleton from './ViewPostSkeleton'
import Button from '../Button'
import Photo from '../Photo'
import Like from '../Like'
import { dateToString } from '@/shared/functions/dateToString'
import ToggleDraftedButton from './ToggleDraftedButton'
import DeleteButton from './DeleteButton'
import { photoModalStore } from '@/stores/photoModal.store'
import ViewPostLayout from '@/layouts/ViewPostLayout/ViewPostLayout'
import { DEFAULTS, PAGES } from '@/constants'
import { usePathname } from 'next/navigation'
import AuthorHeader from '../AuthorHeader'
import styles from './ViewPost.module.scss'

const ViewPost = observer(() => {
  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.post.getOne.queryOptions(
      { id: String(postStore.postId) },
      { enabled: !!postStore.postId }
    )
  )
  const pathname = usePathname()

  if (!postStore.postHeight) {
    return
  }

  if (!data) {
    return <ViewPostSkeleton height={postStore.postHeight} />
  }

  return (
    <ViewPostLayout height={postStore.postHeight}>
      <div className={styles.post__top}>
        <header className={styles.post__header}>
          <AuthorHeader
            clickable={!data.isMy && pathname !== PAGES.USER(data.authorId)}
            authorId={data.authorId}
            authorName={data.author.name}
            isMy={data.isMy}
            avatar={data.author.avatar}
            createdAt={data.createdAt}
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
        {data.description && (
          <div className={styles.post__description}>{data.description}</div>
        )}
        <div className={styles.post__photos}>
          {data.photos.map((p, i) => (
            <Button
              color='icon'
              key={p.id}
              onClick={() => {
                photoModalStore.open({
                  photos: data.photos,
                  current: p.order
                })
              }}
            >
              <Photo
                className={styles.post__photo}
                src={p.optimizedUrl}
                render={postStore.isRenderReady || i < 4}
                gpuAcc
                mini
              />
            </Button>
          ))}
        </div>
      </div>
      <div className={styles.post__bottom}>
        <Like
          className='align-start'
          postId={data.id}
          color={data.primaryColor || DEFAULTS.LIKE_COLOR}
          likes={data.likesCount}
          isLiked={data.isLiked}
        />
        <div className={styles.post__buttons}>
          {data.rawArchiveUrl && (
            <a
              href={data.rawArchiveUrl}
              download
            >
              <Button
                tabindex={-1}
                color='solid'
              >
                скачать исходники (архив)
              </Button>
            </a>
          )}
          {data.isMy && (
            <>
              <ToggleDraftedButton
                id={data.id}
                isDrafted={data.isDrafted}
              />
              <DeleteButton id={data.id} />
            </>
          )}
        </div>
        <div className={styles.post__info}>
          <p className='subtitle mono'>
            created_at {dateToString(data.createdAt)}
          </p>
        </div>
      </div>
    </ViewPostLayout>
  )
})

export default ViewPost
