import { api } from '@/shared/api/trpc'
import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/shared/ui/ErrorSection'
import ClientActions from './ClientActions'

const Actions = catchError(
  async () => {
    const draftedLength = await api.post.my.getDraftedLength.query()

    return <ClientActions draftedLength={draftedLength} />
  },
  () => <ErrorSection name='кнопки' />
)

export default Actions
