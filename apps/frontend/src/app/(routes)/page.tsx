import { DEFAULTS } from '@/constants'
import { redirect } from 'next/navigation'

const Init = () => {
  return redirect(DEFAULTS.START_PAGE)
}

export default Init
