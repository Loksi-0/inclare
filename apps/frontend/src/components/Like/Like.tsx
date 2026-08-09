import Button from '../Button'
import { useLike, type LikeProps } from './useLike'

const Like = (props: LikeProps) => {
  const {
    VIEW_BOX_X,
    PIXEL_SIZE,
    VIEW_BOX_Y,
    clipId,
    outlineRef,
    groupRef,
    pixelsData,
    likes,
    onClick
  } = useLike(props)

  return (
    <Button
      className='align-start'
      color='icon'
      onClick={onClick}
    >
      <svg
        width={VIEW_BOX_X}
        height={VIEW_BOX_Y}
        viewBox={`0 0 ${VIEW_BOX_X} ${VIEW_BOX_Y}`}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <clipPath id={clipId}>
            <path
              d='M21.0546 6.69174L11.0545 17.0447L1.05457 6.69174L6.76881 1.04468L11.0545 5.12311L15.3403 1.04468L21.0546 6.69174Z'
              fill='black'
            />
          </clipPath>
        </defs>
        <g>
          <g
            clipPath={`url(#${clipId})`}
            ref={groupRef}
          >
            {pixelsData.map((p) => (
              <rect
                key={p.id}
                width={PIXEL_SIZE + 0.5}
                height={PIXEL_SIZE + 0.5}
                x={p.x}
                y={p.y}
                fill={p.fill}
              />
            ))}
          </g>
          <path
            ref={outlineRef}
            d='M21.0546 6.69174L11.0545 17.0447L1.05457 6.69174L6.76881 1.04468L11.0545 5.12311L15.3403 1.04468L21.0546 6.69174Z'
            stroke='#1A1F21'
            strokeWidth='1.5'
          />
        </g>
      </svg>
      {typeof likes === 'number' && <p className='subtitle mono'>{likes}</p>}
    </Button>
  )
}

export default Like
