import Image from '@/components/Image'
import cx from 'clsx'
import styles from './Bio.module.scss'

type BioProps = {
  avatar: string | null
  name: string
  description: string | null
}

const Bio = (props: BioProps) => {
  return (
    <div className={styles.bio}>
      {props.avatar ? (
        <Image
          className={styles.bio__avatar}
          src={props.avatar}
          width={120}
          height={120}
        />
      ) : (
        <div className={cx(styles.bio__avatar, styles.skeleton)}></div>
      )}
      <div className={styles.bio__body}>
        <h1>{props.name}</h1>
        {props.description && <p>{props.description}</p>}
      </div>
    </div>
  )
}

export default Bio
