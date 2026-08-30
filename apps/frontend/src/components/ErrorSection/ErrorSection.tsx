'use client'

import Button from '../Button'
import styles from './ErrorSection.module.scss'

const ErrorSection = ({ name }: { name: string }) => {
  return (
    <section className={styles.section}>
      <p>Не удалось загрузить {name.toLowerCase()}</p>
      <Button
        color='solid'
        onClick={() => {
          window.location.reload()
        }}
      >
        повторить
      </Button>
    </section>
  )
}

export default ErrorSection
