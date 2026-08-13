import Photo from '@/components/Photo'
import styles from './TimelinePhoto.module.scss'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import cx from 'clsx'
import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import { timelineStore } from '@/stores/timeline.store'
import { TIMELINE_PADDING } from '@/constants'

type TimelinePhotoProps = {
  src: string
  createdAt: Date
  pcs: number
  id: string
  year?: number
}

const TimelinePhoto = (props: TimelinePhotoProps) => {
  const { src, id, createdAt, pcs, year } = props

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
      <Button
        color='icon'
        onClick={() => {
          postStore.open(
            id,
            timelineStore.timelineRef
              ? timelineStore.timelineRef.offsetHeight + TIMELINE_PADDING * 2
              : undefined
          )
        }}
      >
        <Photo src={src} />
      </Button>
    </div>
  )
}

export default TimelinePhoto
