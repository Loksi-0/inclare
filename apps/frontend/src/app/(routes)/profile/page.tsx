import { api } from '@/shared/api/trpc'
import { PAGES } from '@/constants'
import PageLayout from '@/shared/layouts/PageLayout'
import Actions from '@/screens/profile/Actions'
import Me from '@/screens/profile/Me'
import ProfileTimeline from '@/screens/profile/ProfileTimeline'
import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const me = await api.user.me.query()

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
