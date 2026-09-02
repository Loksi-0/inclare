import { api } from '@/api/trpc'
import { PAGES } from '@/constants'
import PageLayout from '@/layouts/PageLayout'
import Actions from '@/widgets/profile/Actions'
import Me from '@/widgets/profile/Me'
import ProfileTimeline from '@/widgets/profile/ProfileTimeline'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const me = await api.auth.me.query()

  return {
    title: `Профиль / ${me.name}`,
    description: me.description,
    openGraph: {
      title: me.name,
      description: me.description || undefined,
      images: me.avatar ? [me.avatar] : []
    }
  }
}

export const dynamic = 'force-dynamic'

const Profile = () => {
  return (
    <PageLayout
      profile
      padding
      gestures={{ forward: PAGES.PLANE }}
    >
      <Me />
      <ProfileTimeline />
      <Actions />
    </PageLayout>
  )
}

export default Profile
