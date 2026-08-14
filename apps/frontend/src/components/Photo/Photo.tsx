import Image from 'next/image'
import cx from 'clsx'
import styles from './Photo.module.scss'

type PhotoProps = {
  src: string
  className?: string
  mini?: boolean
}

const Photo = (props: PhotoProps) => {
  const { src, className, mini = false } = props

  return (
    <div className={cx(styles.photo, className, [{ [styles.mini]: mini }])}>
      <Image
        className={styles.photo__image}
        src={src}
        alt=''
        width={200}
        height={250}
        draggable={false}
        loading='lazy'
        decoding='async'
      />
    </div>
  )
}

export default Photo
