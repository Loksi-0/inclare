import { api } from '@/api/trpc'
import ClientDrafts from './ClientDrafts'

const DraftsList = async () => {
  const drafts = await api.post.my.getDrafted.query()

  return <ClientDrafts data={drafts} />
}

export default DraftsList
