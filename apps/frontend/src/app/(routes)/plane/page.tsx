import PageLayout from '@/layouts/PageLayout'
import PlaneWidget from '@/widgets/plane'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Плоскость',
  description: 'Исследуйте Inclare на бесконечной плоскости',
  openGraph: {
    title: 'Плоскость',
    description: 'Исследуйте Inclare на бесконечной плоскости'
  }
}

const Plane = () => {
  return (
    <PageLayout plane>
      <PlaneWidget />
    </PageLayout>
  )
}

export default Plane
