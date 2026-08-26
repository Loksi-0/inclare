import { DEFAULTS } from '@/constants'
import { useCustomContext } from '@/shared/hooks/useCustomContext'
import { PlaneContext } from '@/contexts/PlaneContext'
import PlanePhoto from './PlanePhoto/PlanePhoto'
import styles from './Plane.module.scss'

const PlaneContent = () => {
  const { isMounted, chunks, CHUNK_WIDTH, CHUNK_HEIGHT, onClick } =
    useCustomContext(PlaneContext)

  return (
    isMounted &&
    chunks.map((c) => (
      <div
        key={`${c.pos.x}-${c.pos.y}`}
        className={styles.plane__chunk}
        style={{
          transform: `translateX(${CHUNK_WIDTH * c.pos.x * -1}px) translateY(${CHUNK_HEIGHT * c.pos.y * -1}px)`,
          width: CHUNK_WIDTH,
          height: CHUNK_HEIGHT
        }}
      >
        <div className={styles.plane__chunkContent}>
          {c.data &&
            c.data.map((p) => (
              <PlanePhoto
                className={styles.plane__post}
                key={p.id}
                postId={p.id}
                src={p.previewUrl}
                likes={p.likesCount}
                isLiked={p.isLiked}
                color={p.primaryColor || DEFAULTS.LIKE_COLOR}
                onClick={onClick}
                style={{
                  left: p.pos.x,
                  top: p.pos.y
                }}
              />
            ))}
        </div>
      </div>
    ))
  )
}

export default PlaneContent
