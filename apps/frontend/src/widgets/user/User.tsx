import { catchError } from '@/shared/functions/catchError'
import NotFound from '../not-found'
import { api } from '@/api/trpc'
import PageLayout from '@/layouts/PageLayout'
import Bio from './Bio/Bio'
import UserTimeline from './UserTimeline'
import BackButton from './Actions/Actions'

type UserProps = {
  uuid: string
}

const User = catchError(
  async ({ uuid }: UserProps) => {
    const user = await api.user.getOne.query({ id: uuid })

    return (
      <PageLayout profile>
        <Bio
          avatar={user.avatar}
          name={user.name}
          description={user.description}
        />
        <UserTimeline uuid={uuid} />
        <BackButton />
      </PageLayout>
    )
  },
  () => <NotFound user />
)

export default User
