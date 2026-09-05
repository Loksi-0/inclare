'use client'

import { useId } from 'react'
import { useGradient } from './useGradient'

const Gradient = () => {
  const { containerRef, radius } = useGradient()

  const blurId = useId()
  const CIRCLES = ['#B36FDC', '#FF8057']

  return (
    <svg
      style={{
        width: '100%',
        height: '100%'
      }}
      ref={containerRef}
    >
      <defs>
        <filter
          id={blurId}
          width='500%'
          height='500%'
          x='-100%'
          y='-100%'
        >
          <feGaussianBlur stdDeviation='50' />
        </filter>
      </defs>
      <rect
        fill='#F8D859'
        style={{
          width: '100%',
          height: '100%'
        }}
      />
      <g filter={`url(#${blurId})`}>
        {CIRCLES.map((c, i) => (
          <circle
            key={`${c}-${i}`}
            r={radius}
            fill={c}
          />
        ))}
      </g>
    </svg>
  )
}

export default Gradient
