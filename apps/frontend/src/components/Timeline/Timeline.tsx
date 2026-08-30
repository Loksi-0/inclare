'use client'

import { CURSOR } from '@/constants'
import TimelinePhoto from './TimelinePhoto/TimelinePhoto'
import { useTimeline, type Post } from './useTimeline'
import { randomCode } from '@/shared/functions/randomCode'
import styles from './Timeline.module.scss'

type TimelineProps = {
  data: Post[]
}

const Timeline = (props: TimelineProps) => {
  const { data } = props

  const {
    timelineRef,
    bodyRef,
    lastRef,
    groups,
    groupsPos,
    firstYearsPosts,
    isMounted
  } = useTimeline(data)

  return (
    <section
      ref={timelineRef}
      className={styles.timeline}
      data-cursor={CURSOR.GRAB}
    >
      <div className={styles.timeline__line}></div>
      <div
        ref={bodyRef}
        className={styles.timeline__body}
      >
        {isMounted &&
          groups.map((g, i) => (
            <div
              ref={i === groups.length - 1 ? lastRef : undefined}
              key={g.at(0)?.id || randomCode(6)}
              className={styles.timeline__group}
              style={{
                transform: `translateX(${groupsPos[i]}px)`
              }}
            >
              {g.map(
                (p) =>
                  p.previewUrl && (
                    <TimelinePhoto
                      key={p.id}
                      src={p.previewUrl}
                      createdAt={p.createdAt}
                      pcs={p.pcs}
                      id={p.id}
                      year={
                        firstYearsPosts.has(p.id)
                          ? p.createdAt.getFullYear()
                          : undefined
                      }
                    />
                  )
              )}
            </div>
          ))}
      </div>
    </section>
  )
}

export default Timeline
