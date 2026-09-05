import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/shared/ui/ErrorSection'
import { api } from '@/shared/api/trpc'
import Me from '@/screens/moderator/Me'
import Header from '@/shared/ui/Header'
import ModeratingPosts from '@/screens/moderator/ModeratingPosts'
import Tabs from '@/shared/ui/Tabs'
import Moderators from '@/screens/moderator/Moderators'
import Users from '@/screens/moderator/Users'
import Config from '@/screens/moderator/Config'
import styles from './Moderator.module.scss'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false }
}

export const dynamic = 'force-dynamic'

const Moderator = catchError(
  async () => {
    const me = await api.user.me.query()

    return (
      <div className={styles.moderator}>
        <Header />
        <div className={styles.moderator__body}>
          <Me
            avatar={me.avatar}
            name={me.name}
            role={me.role}
          />
          <Tabs
            className={styles.moderator__tabs}
            data={[
              { title: 'посты', content: <ModeratingPosts /> },
              {
                title: 'пользователи',
                content: (
                  <Users
                    role={me.role}
                    myEmail={me.email}
                  />
                )
              },
              ...(me.role === 'ADMIN'
                ? [
                    { title: 'модераторы', content: <Moderators /> },
                    { title: 'конфиг', content: <Config /> }
                  ]
                : [])
            ]}
            maxWidth={700}
          />
        </div>
      </div>
    )
  },
  () => <ErrorSection name='модераторскую' />
)

export default Moderator
