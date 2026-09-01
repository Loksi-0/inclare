'use client'

import { useEffect, useRef } from 'react'

type UseSwipeProps = {
  strength: 'light' | 'medium' | 'hard'
  onBottomToTop?: () => void
  onTopToBottom?: () => void
  onLeftToRight?: () => void
  onRightToLeft?: () => void
  onVertical?: () => void
  onHorizontal?: () => void
  ref?: HTMLElement | null
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
    touchDelta: 100,
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
    onRightToLeft,
    onVertical,
    onHorizontal,
    ref
  } = props

  const { timeDelta, touchDelta } = strengthMap[strength] || strengthMap.light

  const firstTouch = useRef({
    x: 0,
    y: 0,
    timestamp: 0
  })

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (ref) {
        e.stopImmediatePropagation()
      }

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
      if (ref) {
        e.stopImmediatePropagation()
      }

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
        if (onHorizontal) {
          onHorizontal()
        } else {
          onLeftToRight?.()
        }
      } else if (changeX < 0 && absX > touchDelta) {
        if (onHorizontal) {
          onHorizontal()
        } else {
          onRightToLeft?.()
        }
      }

      if (changeY > 0 && changeY > touchDelta) {
        if (onVertical) {
          onVertical()
        } else {
          onTopToBottom?.()
        }
      } else if (changeY < 0 && absY > touchDelta) {
        if (onVertical) {
          onVertical()
        } else {
          onBottomToTop?.()
        }
      }
    }

    if (ref) {
      ref.addEventListener('touchstart', onTouchStart)
      ref.addEventListener('touchend', onTouchEnd)
    } else {
      document.addEventListener('touchstart', onTouchStart)
      document.addEventListener('touchend', onTouchEnd)
    }

    return () => {
      if (ref) {
        ref.removeEventListener('touchstart', onTouchStart)
        ref.removeEventListener('touchend', onTouchEnd)
      } else {
        document.removeEventListener('touchstart', onTouchStart)
        document.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [])
}
