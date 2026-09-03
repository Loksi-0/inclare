import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/components/ErrorSection'
import { api } from '@/api/trpc'
import ClientMe from './ClientMe'

const Me = catchError(
  async () => {
    const me = await api.user.me.query()

    return <ClientMe data={me} />
  },
  () => <ErrorSection name='профиль' />
)

export default Me
