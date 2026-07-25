import { api } from '@/api/trpc'
import PageLayout from '@/layouts/PageLayout'

const Profile = async () => {
  const data = await api.auth.me.query()

  return <PageLayout>{data.totalArchived}</PageLayout>
}

export default Profile
