import { api } from '@/api/trpc'
import ErrorSection from '@/components/ErrorSection'
import Timeline from '@/components/Timeline'
import { catchError } from '@/shared/functions/catchError'

const ProfileTimeline = catchError(
  async () => {
    const data = await api.post.my.getPublished.query()

    return <Timeline data={data} />
  },
  () => <ErrorSection name='таймлайн' />
)

export default ProfileTimeline
