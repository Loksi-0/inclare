import PageLayout from '@/layouts/PageLayout'
import Actions from '@/widgets/profile/Actions'
import Me from '@/widgets/profile/Me'
import ProfileTimeline from '@/widgets/profile/ProfileTimeline'

const Profile = () => {
  return (
    <PageLayout profile>
      <Me />
      <ProfileTimeline />
      <Actions />
    </PageLayout>
  )
}

export default Profile
