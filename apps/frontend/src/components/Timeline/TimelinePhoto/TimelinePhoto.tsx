import Photo from '@/components/Photo'
import styles from './TimelinePhoto.module.scss'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import cx from 'clsx'
import Button from '@/components/Button'
import { postStore } from '@/stores/post.store'
import { timelineStore } from '@/stores/timeline.store'
import { TIMELINE_PADDING } from '@/constants'
import { useBlur } from '@/shared/hooks/useBlur'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type TimelinePhotoProps = {
  src: string
  createdAt: Date
  pcs: number
  id: string
  year?: number
  unoptimized?: boolean
}

const TimelinePhoto = (props: TimelinePhotoProps) => {
  const { src, id, createdAt, pcs, year, unoptimized = false } = props

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
          postStore.open(
            id,
            timelineStore.timelineRef
              ? timelineStore.timelineRef.offsetHeight + TIMELINE_PADDING * 2
              : undefined
          )
        }}
      >
        <Photo
          src={src}
          unoptimized={unoptimized}
        />
      </Button>
    </div>
  )
}

export default TimelinePhoto
