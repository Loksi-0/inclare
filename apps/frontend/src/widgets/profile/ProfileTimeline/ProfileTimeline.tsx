import { api } from '@/api/trpc'
import Button from '@/components/Button'
import ErrorSection from '@/components/ErrorSection'
import Misted from '@/components/Misted'
import Timeline from '@/components/Timeline'
import Logo from '@/icons/Logo'
import { catchError } from '@/shared/functions/catchError'
import styles from './ProfileTimeline.module.scss'

const ProfileTimeline = catchError(
  async () => {
    const data = await api.post.my.getPublished.query()

    if (!data[0]) {
      return (
        <section className={styles.timeline}>
          <Misted size={10}>
            <div className={styles.timeline__logo}>
              <Logo />
            </div>
          </Misted>
          <div className={styles.timeline__body}>
            <h2>У вас пока что нет постов</h2>
            <Button color='outlined'>загрузить пачку</Button>
          </div>
        </section>
      )
    }

    return <Timeline data={data} />
  },
  () => <ErrorSection name='таймлайн' />
)

export default ProfileTimeline
