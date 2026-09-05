import PageLayout from '@/shared/layouts/PageLayout'
import PlaneWidget from '@/screens/plane'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Плоскость',
  description: 'Исследуйте Inclare на бесконечной плоскости',
  openGraph: {
    title: 'Плоскость',
    description: 'Исследуйте Inclare на бесконечной плоскости',
    images: ['/favicon/web-app-manifest-192x192.png']
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
