import { api } from '@/api/trpc'
import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/components/ErrorSection'
import ClientActions from './ClientActions'

const Actions = catchError(
  async () => {
    const draftedLength = await api.post.my.getDraftedLength.query()

    return <ClientActions draftedLength={draftedLength} />
  },
  () => <ErrorSection name='кнопки' />
)

export default Actions
