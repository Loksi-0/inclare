import PageLayout from '@/layouts/PageLayout'
import Me from '@/widgets/profile/Me'
import ProfileTimeline from '@/widgets/profile/ProfileTimeline'

const Profile = () => {
  return (
    <PageLayout profile>
      <Me />
      <ProfileTimeline />
    </PageLayout>
  )
}

export default Profile
