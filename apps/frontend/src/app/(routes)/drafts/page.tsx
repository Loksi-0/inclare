import PageLayout from '@/layouts/PageLayout'
import DraftsList from '@/widgets/drafts'
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
    <PageLayout>
      <DraftsList />
    </PageLayout>
  )
}

export default Drafts
