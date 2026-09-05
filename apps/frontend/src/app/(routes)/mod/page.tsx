import type { Metadata } from 'next'
import ModeratorPage from '@/screens/moderator'

export const metadata: Metadata = {
  robots: { index: false, follow: false }
}

export const dynamic = 'force-dynamic'

const Moderator = () => {
  return <ModeratorPage />
}

export default Moderator
