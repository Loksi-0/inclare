import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/components/ErrorSection'
import { api } from '@/api/trpc'
import Me from '@/widgets/moderator/Me'
import Header from '@/components/Header'
import ModeratingPosts from '@/widgets/moderator/ModeratingPosts'
import Tabs from '@/components/Tabs'
import Moderators from '@/widgets/moderator/Moderators'
import Users from '@/widgets/moderator/Users'
import Config from '@/widgets/moderator/Config'
import styles from './Moderator.module.scss'

const Moderator = catchError(
  async () => {
    const me = await api.auth.me.query()

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
