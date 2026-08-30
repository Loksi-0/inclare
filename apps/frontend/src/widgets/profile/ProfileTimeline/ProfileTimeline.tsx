import { api } from '@/api/trpc'
import ErrorSection from '@/components/ErrorSection'
import { catchError } from '@/shared/functions/catchError'
import ClientProfileTimeline from './ClientProfileTimeline'

const ProfileTimeline = catchError(
  async () => {
    const data = await api.post.my.getPublished.query()

    return <ClientProfileTimeline data={data} />
  },
  () => <ErrorSection name='таймлайн' />
)

export default ProfileTimeline
