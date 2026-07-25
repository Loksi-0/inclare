import { api } from '@/api/trpc'

const Profile = async () => {
  const data = await api.auth.me.query()

  return <p>{data.totalArchived}</p>
}

export default Profile
