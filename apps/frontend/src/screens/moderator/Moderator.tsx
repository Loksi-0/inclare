import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/shared/ui/ErrorSection'
import { api } from '@/shared/api/trpc'
import Header from '@/shared/ui/Header'
import Tabs from '@/shared/ui/Tabs'
import Me from './components/Me/Me'
import ModeratingPosts from './components/ModeratingPosts/ModeratingPosts'
import Moderators from './components/Moderators/Moderators'
import Users from './components/Users/Users'
import Config from './components/Config/Config'
import styles from './Moderator.module.scss'

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
