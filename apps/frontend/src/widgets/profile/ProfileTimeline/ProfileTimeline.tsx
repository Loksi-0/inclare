import { api } from '@/api/trpc'
import ErrorSection from '@/components/ErrorSection'
import Timeline from '@/components/Timeline'
import { catchError } from '@/shared/functions/catchError'

const ProfileTimeline = catchError(
  async () => {
    const data = await api.post.my.getPublished.query()

    return (
      <Timeline
        data={data.map((d) => ({
          ...d,
          previewUrl: d.photos[0].optimizedUrl,
          pcs: d.photos.length
        }))}
      />
    )
  },
  () => <ErrorSection name='таймлайн' />
)

export default ProfileTimeline
