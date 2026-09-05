import { api } from '@/shared/api/trpc'
import ClientDrafts from './ClientDrafts'
import DraftsLayout from './components/drafts.layout'
import { catchError } from '@/shared/functions/catchError'
import ErrorSection from '@/shared/ui/ErrorSection'
import styles from './DraftsList.module.scss'

const DraftsList = catchError(
  async () => {
    const drafts = await api.post.my.getDrafted.query()

    if (!drafts.at(0)) {
      return (
        <DraftsLayout>
          <div className={styles.drafts__placeholder}>
            у вас пока нет черновиков
          </div>
        </DraftsLayout>
      )
    }

    return <ClientDrafts data={drafts} />
  },
  () => <ErrorSection name='черновики' />
)

export default DraftsList
