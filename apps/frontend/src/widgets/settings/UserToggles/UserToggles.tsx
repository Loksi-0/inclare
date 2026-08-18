import { api } from '@/api/trpc'
import ErrorSection from '@/components/ErrorSection'
import { catchError } from '@/shared/functions/catchError'
import ClientUserToggles from './ClientUserToggles'

const UserToggles = catchError(
  async () => {
    const me = await api.auth.me.query()

    return <ClientUserToggles isPrivate={me.isPrivate} />
  },
  () => <ErrorSection name='тумблеры' />
)

export default UserToggles
