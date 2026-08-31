'use client'

import { useEffect, useRef } from 'react'

type UseSwipeProps = {
  touchDelta: number
  timeDelta: number
  onBottomToTop?: () => void
  onTopToBottom?: () => void
  onLeftToRight?: () => void
  onRightToLeft?: () => void
}

export const useSwipe = (props: UseSwipeProps) => {
  const propsRef = useRef(props)
  const firstTouch = useRef({
    x: 0,
    y: 0,
    timestamp: 0
  })

  propsRef.current = props

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

      const {
        touchDelta,
        timeDelta,
        onBottomToTop,
        onTopToBottom,
        onLeftToRight,
        onRightToLeft
      } = propsRef.current

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
