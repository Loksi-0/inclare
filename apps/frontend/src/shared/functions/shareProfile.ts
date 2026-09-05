import { PAGES } from '@/constants'
import { toast } from '../../features/toast/toast'

export const shareProfile = async (id: string) => {
  const pathname = PAGES.USER(id)
  const origin = window.location.origin

  const url = `${origin}${pathname}`

  try {
    await navigator.clipboard.writeText(url)
    toast.message('Ссылка на профиль скопирована')
  } catch {
    toast.error('Не удалось скопировать ссылку')
  }
}
