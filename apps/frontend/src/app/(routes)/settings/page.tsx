import PageLayout from '@/layouts/PageLayout'
import SettingsHeader from '@/widgets/settings/SettingsHeader'
import UpdateProfile from '@/widgets/settings/UpdateProfile'
import UserActions from '@/widgets/settings/UserActions'
import UserToggles from '@/widgets/settings/UserToggles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Настройки',
  openGraph: {
    title: 'Настройки'
  }
}

const Settings = () => {
  return (
    <PageLayout
      className='container-small'
      settings
    >
      <SettingsHeader />
      <UpdateProfile />
      <UserToggles />
      <UserActions />
    </PageLayout>
  )
}

export default Settings
