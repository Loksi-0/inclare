'use client'

import { useEffect, useRef } from 'react'

type UseSwipeProps = {
  strength: 'light' | 'medium' | 'hard'
  onBottomToTop?: () => void
  onTopToBottom?: () => void
  onLeftToRight?: () => void
  onRightToLeft?: () => void
}

type StrengthDelta = {
  touchDelta: number
  timeDelta: number
}

const strengthMap: Record<UseSwipeProps['strength'], StrengthDelta> = {
  light: {
    touchDelta: 40,
    timeDelta: 200
  },
  medium: {
    touchDelta: 80,
    timeDelta: 350
  },
  hard: {
    touchDelta: 150,
    timeDelta: 500
  }
}

export const useSwipe = (props: UseSwipeProps) => {
  const {
    strength,
    onBottomToTop,
    onTopToBottom,
    onLeftToRight,
    onRightToLeft
  } = props

  const { timeDelta, touchDelta } = strengthMap[strength] || strengthMap.light

  const firstTouch = useRef({
    x: 0,
    y: 0,
    timestamp: 0
  })

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const startTouch = [...e.touches].at(0)

      if (!startTouch) {
        return
      }

      firstTouch.current = {
        x: startTouch.screenX,
        y: startTouch.screenY,
        timestamp: Date.now()
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const endTouch = [...e.changedTouches].at(0)

      if (!endTouch) {
        return
      }

      const endTouchTimestamp = Date.now()

      if (endTouchTimestamp - firstTouch.current.timestamp > timeDelta) {
        return
      }

      const changeX = endTouch.screenX - firstTouch.current.x
      const changeY = endTouch.screenY - firstTouch.current.y

      const absX = Math.abs(changeX)
      const absY = Math.abs(changeY)

      if (changeX > 0 && changeX > touchDelta) {
        onLeftToRight?.()
      } else if (changeX < 0 && absX > touchDelta) {
        onRightToLeft?.()
      }

      if (changeY > 0 && changeY > touchDelta) {
        onTopToBottom?.()
      } else if (changeY < 0 && absY > touchDelta) {
        onBottomToTop?.()
      }
    }

    document.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchend', onTouchEnd)

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])
}
