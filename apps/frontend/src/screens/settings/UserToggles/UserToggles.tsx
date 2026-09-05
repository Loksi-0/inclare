import { api } from '@/shared/api/trpc'
import ErrorSection from '@/shared/ui/ErrorSection'
import { catchError } from '@/shared/functions/catchError'
import ClientUserToggles from './ClientUserToggles'

const UserToggles = catchError(
  async () => {
    const me = await api.user.me.query()

    return <ClientUserToggles isPrivate={me.isPrivate} />
  },
  () => <ErrorSection name='тумблеры' />
)

export default UserToggles
