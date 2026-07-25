import Header from '@/components/Header'
import type { PropsWithChildren } from 'react'

const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
    </>
  )
}

export default PageLayout
