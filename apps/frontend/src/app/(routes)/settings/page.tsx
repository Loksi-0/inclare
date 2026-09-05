import { PAGES } from '@/constants'
import PageLayout from '@/shared/layouts/PageLayout'
import SettingsHeader from '@/screens/settings/SettingsHeader'
import UpdateProfile from '@/screens/settings/UpdateProfile'
import UserActions from '@/screens/settings/UserActions'
import UserToggles from '@/screens/settings/UserToggles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Настройки',
  openGraph: {
    title: 'Настройки'
  },
  robots: { index: false, follow: true }
}

export const dynamic = 'force-dynamic'

const Settings = () => {
  return (
    <PageLayout
      className='container-small'
      settings
      overflow
      gestures={{ back: PAGES.PROFILE }}
    >
      <SettingsHeader />
      <UpdateProfile />
      <UserToggles />
      <UserActions />
    </PageLayout>
  )
}

export default Settings
