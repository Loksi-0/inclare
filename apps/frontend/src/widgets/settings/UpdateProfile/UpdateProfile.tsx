import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/components/ErrorSection'
import { api } from '@/api/trpc'
import ClientUpdateProfile from './ClientUpdateProfile'

const UpdateProfile = catchError(
  async () => {
    const me = await api.auth.me.query()

    return <ClientUpdateProfile data={me} />
  },
  () => <ErrorSection name='профиль' />
)

export default UpdateProfile
