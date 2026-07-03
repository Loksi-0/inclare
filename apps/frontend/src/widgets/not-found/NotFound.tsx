import Logo from '@/icons/Logo'
import Button from '@/components/Button'
import styles from './NotFound.module.scss'

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__logo}>
        <Logo />
      </div>
      <div className={styles.notFound__body}>
        <div className={styles.notFound__content}>
          <h1 className={styles.notFound__title}>404</h1>
          <p className={styles.notFound__description}>PAGE_NOT_FOUND</p>
        </div>
        <Button
          color='solid'
          navigate='back'
        >
          {'<-'} назад
        </Button>
      </div>
    </div>
  )
}

export default NotFound
