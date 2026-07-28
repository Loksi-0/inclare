'use client'

import { useRouter } from 'next/navigation'
import Button from '../Button'
import styles from './ErrorSection.module.scss'

const ErrorSection = ({ name }: { name: string }) => {
  const router = useRouter()

  return (
    <section className={styles.section}>
      <p>Не удалось загрузить {name.toLowerCase()}</p>
      <Button
        color='solid'
        onClick={() => router.refresh()}
      >
        повторить
      </Button>
    </section>
  )
}

export default ErrorSection
