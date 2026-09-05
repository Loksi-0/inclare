import Button from '@/shared/ui/Button'
import { PAGES } from '@/constants'

const SettingsHeader = () => {
  return (
    <header>
      <Button
        color='underline'
        navigate={PAGES.PROFILE}
      >
        {'<-'} назад
      </Button>
    </header>
  )
}

export default SettingsHeader
