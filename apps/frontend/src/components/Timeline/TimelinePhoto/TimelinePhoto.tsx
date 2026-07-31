import Photo from '@/components/Photo'
import styles from './TimelinePhoto.module.scss'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import cx from 'clsx'

type TimelinePhotoProps = {
  src: string
  createdAt: Date
  pcs: number
  year?: number
}

const TimelinePhoto = (props: TimelinePhotoProps) => {
  const { src, createdAt, pcs, year } = props

  return (
    <div className={cx(styles.photo, [{ [styles.year]: year }])}>
      <div className={styles.photo__line}></div>
      {year && (
        <div className={styles.photo__year}>
          <div className={styles.photo__yearLine}></div>
          <p className={styles.photo__yearText}>{year}</p>
        </div>
      )}
      <p className={styles.photo__title}>
        {dateToMonth(createdAt)} (x{pcs})
      </p>
      <Photo src={src} />
    </div>
  )
}

export default TimelinePhoto
