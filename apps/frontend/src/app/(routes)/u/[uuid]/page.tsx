import { api } from '@/api/trpc'
import PageLayout from '@/layouts/PageLayout'
import { catchError } from '@/shared/functions/catchError'
import NotFound from '@/widgets/not-found'
import Actions from '@/widgets/user/Actions'
import Bio from '@/widgets/user/Bio'
import UserTimeline from '@/widgets/user/UserTimeline'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ uuid: string }>
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  try {
    const { uuid } = await params

    const user = await api.user.getOne.query({ id: uuid })

    return {
      title: `Профиль / ${user.name}`,
      description: user.description,
      openGraph: {
        title: user.name,
        description: user.description || undefined,
        images: user.avatar ? [user.avatar] : []
      }
    }
  } catch {
    return {
      robots: { index: false, follow: false }
    }
  }
}

const User = catchError(
  async ({ params }: Props) => {
    const { uuid } = await params
    const user = await api.user.getOne.query({ id: uuid })

    return (
      <PageLayout profile>
        <Bio
          avatar={user.avatar}
          name={user.name}
          description={user.description}
        />
        <UserTimeline uuid={uuid} />
        <Actions />
      </PageLayout>
    )
  },
  () => <NotFound user />
)

export default User
