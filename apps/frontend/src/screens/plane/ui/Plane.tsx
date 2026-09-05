import { api } from '@/shared/api/trpc'
import ErrorSection from '@/shared/ui/ErrorSection'
import { catchError } from '@/shared/functions/catchError'
import ClientPlane from './ClientPlane'
import { PlaneProvider } from '../model/PlaneContext'

const Plane = catchError(
  async () => {
    const limit = 3
    const data = await api.feed.getFeed.query({ limit })

    return (
      <PlaneProvider props={{ limit, firstData: data }}>
        <ClientPlane />
      </PlaneProvider>
    )
  },
  () => <ErrorSection name='плоскость' />
)

export default Plane
