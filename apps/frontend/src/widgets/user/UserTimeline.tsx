import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/components/ErrorSection'
import { api } from '@/api/trpc'
import Timeline from '@/components/Timeline'

type UserTimelineProps = {
  uuid: string
}

const UserTimeline = catchError(
  async ({ uuid }: UserTimelineProps) => {
    const posts = await api.post.getUserPosts.query({ userId: uuid })

    if (!posts.at(0)) {
      return <div className='mono'>у этого пользователя нет постов</div>
    }

    return <Timeline data={posts} />
  },
  () => <ErrorSection name='посты' />
)

export default UserTimeline
