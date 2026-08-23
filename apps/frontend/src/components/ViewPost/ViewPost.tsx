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
import ToggleDraftedButton from './ToggleDraftedButton'
import DeleteButton from './DeleteButton'
import { photoModalStore } from '@/stores/photoModal.store'
import ViewPostLayout from '@/layouts/ViewPostLayout/ViewPostLayout'
import { DEFAULTS, PAGES } from '@/constants'
import Image from 'next/image'
import AuthorButton from './AuthorButton'
import { usePathname } from 'next/navigation'

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

  const sortedPhotos = data.photos.sort((a, b) => a.order - b.order)
  const isUnoptimized = data.author.isPrivate || data.isDrafted

  return (
    <ViewPostLayout height={postStore.postHeight}>
      <div className={styles.post__top}>
        <header className={styles.post__header}>
          <AuthorButton
            authorId={data.authorId}
            clickable={!data.isMy && pathname !== PAGES.USER(data.authorId)}
          >
            {!data.isMy && data.author.avatar && (
              <Image
                className={styles.post__avatar}
                width={30}
                height={30}
                src={data.author.avatar}
                alt=''
              />
            )}
            <div className='mono subtitle'>
              {data.isMy ? 'me' : data.author.name} /{' '}
              {dateToMonth(data.createdAt)} {data.createdAt.getDate()}
            </div>
          </AuthorButton>
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
          {sortedPhotos.map((p) => (
            <Button
              color='icon'
              key={p.id}
              onClick={() => {
                photoModalStore.open({
                  photos: sortedPhotos,
                  current: p.order,
                  isUnoptimized
                })
              }}
            >
              <Photo
                className={styles.post__photo}
                src={p.optimizedUrl}
                mini
                unoptimized={isUnoptimized}
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
                скачать исходники
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
