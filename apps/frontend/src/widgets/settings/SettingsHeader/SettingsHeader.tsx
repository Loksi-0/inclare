import Button from '@/components/Button'
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
