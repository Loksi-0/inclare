import { api } from '@/shared/api/trpc'
import PageLayout from '@/shared/layouts/PageLayout'
import { catchError } from '@/shared/functions/catchError'
import NotFound from '@/screens/notFound'
import Actions from '@/screens/user/Actions'
import Bio from '@/screens/user/Bio'
import UserTimeline from '@/screens/user/UserTimeline'
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

export const dynamic = 'force-dynamic'

const User = catchError(
  async ({ params }: Props) => {
    const { uuid } = await params
    const user = await api.user.getOne.query({ id: uuid })

    return (
      <PageLayout
        profile
        gestures={{ back: 'back' }}
      >
        <Bio
          id={user.id}
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
