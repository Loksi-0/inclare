import { api } from '@/api/trpc'
import UserPage from '@/widgets/user'
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

const User = async ({ params }: Props) => {
  const { uuid } = await params

  return <UserPage uuid={uuid} />
}

export default User
