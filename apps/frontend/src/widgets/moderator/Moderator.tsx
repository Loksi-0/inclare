import { catchError } from '@/shared/functions/catchError'
import styles from './Moderator.module.scss'
import ErrorSection from '@/components/ErrorSection'
import { api } from '@/api/trpc'
import Me from './Me/Me'
import Header from '@/components/Header'
import ModeratingPosts from './ModeratingPosts'
import Tabs from '@/components/Tabs'
import Moderators from './Moderators/Moderators'
import Users from './Users/Users'
import Config from './Config/Config'

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
