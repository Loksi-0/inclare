import { api } from '@/api/trpc'
import ErrorSection from '@/components/ErrorSection'
import { catchError } from '@/shared/functions/catchError'
import ClientProfileTimeline from './ClientProfileTimeline'

const ProfileTimeline = catchError(
  async () => {
    const data = await api.post.my.getPublished.query()
    const me = await api.auth.me.query()

    return (
      <ClientProfileTimeline
        me={me}
        data={data}
      />
    )
  },
  () => <ErrorSection name='таймлайн' />
)

export default ProfileTimeline
