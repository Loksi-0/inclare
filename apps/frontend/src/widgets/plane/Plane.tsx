import { api } from '@/api/trpc'
import ErrorSection from '@/components/ErrorSection'
import { catchError } from '@/shared/functions/catchError'
import ClientPlane from './ClientPlane'
import { PlaneProvider } from '@/contexts/PlaneContext'

const Plane = catchError(
  async () => {
    const limit = 3
    const data = await api.post.public.getFeed.query({ limit })

    return (
      <PlaneProvider props={{ limit, firstData: data }}>
        <ClientPlane />
      </PlaneProvider>
    )
  },
  () => <ErrorSection name='плоскость' />
)

export default Plane
