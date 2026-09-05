import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/shared/ui/ErrorSection'
import { api } from '@/shared/api/trpc'
import Timeline from '@/features/timeline'
import cx from 'clsx'
import styles from './UserTimeline.module.scss'

type UserTimelineProps = {
  uuid: string
}

const UserTimeline = catchError(
  async ({ uuid }: UserTimelineProps) => {
    const posts = await api.post.getUserPublishedPosts.query({ userId: uuid })

    if (!posts.at(0)) {
      return (
        <div className={cx(styles.timeline__empty, 'mono')}>
          у этого пользователя нет постов
        </div>
      )
    }

    return <Timeline data={posts} />
  },
  () => <ErrorSection name='посты' />
)

export default UserTimeline
