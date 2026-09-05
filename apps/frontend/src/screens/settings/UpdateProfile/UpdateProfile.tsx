import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/shared/ui/ErrorSection'
import { api } from '@/shared/api/trpc'
import ClientUpdateProfile from './ClientUpdateProfile'

const UpdateProfile = catchError(
  async () => {
    const me = await api.user.me.query()

    return <ClientUpdateProfile data={me} />
  },
  () => <ErrorSection name='профиль' />
)

export default UpdateProfile
