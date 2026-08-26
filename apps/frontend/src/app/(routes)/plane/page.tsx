import PageLayout from '@/layouts/PageLayout'
import PlaneWidget from '@/widgets/plane'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.CLIENT_URL || 'https://inclare.ru'),
  title: 'Плоскость',
  description: 'Исследуйте Inclare на бесконечной плоскости',
  openGraph: {
    title: 'Плоскость',
    description: 'Исследуйте Inclare на бесконечной плоскости'
  }
}

export const dynamic = 'force-dynamic'

const Plane = () => {
  return (
    <PageLayout plane>
      <PlaneWidget />
    </PageLayout>
  )
}

export default Plane
