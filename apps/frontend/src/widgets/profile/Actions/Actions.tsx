import { api } from '@/api/trpc'
import styles from './Actions.module.scss'
import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/components/ErrorSection'
import Button from '@/components/Button'
import { decline } from '@/shared/functions/decline'
import { PAGES } from '@/constants'

const Actions = catchError(
  async () => {
    const drafted = await api.post.my.getDrafted.query()

    return (
      <div className={styles.actions}>
        <Button
          className={styles.actions__button}
          color='solid'
          navigate={PAGES.DRAFTS}
        >
          {decline.male(drafted.length, 'черновик')}
        </Button>
        <Button
          className={styles.actions__button}
          color='solid'
        >
          загрузить пачку
        </Button>
      </div>
    )
  },
  () => <ErrorSection name='кнопки' />
)

export default Actions
