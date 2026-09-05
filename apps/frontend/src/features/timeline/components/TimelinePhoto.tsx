import Photo from '@/shared/ui/Photo'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import cx from 'clsx'
import Button from '@/shared/ui/Button'
import { postStore } from '@/features/post'
import { timelineStore } from '../timeline.store'
import { useBlur } from '@/shared/hooks/useBlur'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './TimelinePhoto.module.scss'

type TimelinePhotoProps = {
  src: string
  createdAt: Date
  pcs: number
  id: string
  year?: number
}

const TimelinePhoto = (props: TimelinePhotoProps) => {
  const { src, id, createdAt, pcs, year } = props

  const photoRef = useRef<HTMLDivElement | null>(null)
  const blurOut = useBlur({ from: 10, to: 0 })

  useEffect(() => {
    gsap.fromTo(photoRef.current, { opacity: 0 }, { opacity: 1 })
    blurOut(photoRef.current)
  }, [])

  return (
    <div
      ref={photoRef}
      className={cx(styles.photo, [{ [styles.year]: year }])}
    >
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
          postStore.open(id, timelineStore.getOffset())
        }}
      >
        <Photo src={src} />
      </Button>
    </div>
  )
}

export default TimelinePhoto
