import { PAGES } from '@/constants'
import PageLayout from '@/shared/layouts/PageLayout'
import DraftsList from '@/screens/drafts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Черновики',
  openGraph: {
    title: 'Черновики'
  }
}

export const dynamic = 'force-dynamic'

const Drafts = () => {
  return (
    <PageLayout gestures={{ back: PAGES.PROFILE }}>
      <DraftsList />
    </PageLayout>
  )
}

export default Drafts
