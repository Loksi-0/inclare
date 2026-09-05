'use client'

import { preferencesStore } from '@/shared/stores/preferences.store'
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
  belowY?: number
  aboveY?: number
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
    ref,
    belowY,
    aboveY
  } = props

  const { timeDelta, touchDelta } = strengthMap[strength] || strengthMap.light

  const firstTouch = useRef({
    x: 0,
    y: 0,
    timestamp: 0
  })

  useEffect(() => {
    const getTouch = (e: TouchEvent, isChangedTouch: boolean = false) => {
      if (!preferencesStore.enableGestures) {
        return
      }

      if (
        e.target instanceof HTMLElement &&
        e.target.closest('[data-swipe=false]')
      ) {
        return
      }

      if (ref) {
        e.stopImmediatePropagation()
      }

      const touch = isChangedTouch
        ? [...e.changedTouches].at(0)
        : [...e.touches].at(0)

      if (!touch) {
        return
      }

      if (aboveY && touch.clientY > aboveY) {
        return
      }

      if (belowY && touch.clientY < belowY) {
        return
      }

      return touch
    }

    const onTouchStart = (e: TouchEvent) => {
      const startTouch = getTouch(e)

      if (!startTouch) {
        return
      }

      firstTouch.current = {
        x: startTouch.clientX,
        y: startTouch.clientY,
        timestamp: Date.now()
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const endTouch = getTouch(e, true)

      if (!endTouch) {
        return
      }

      const endTouchTimestamp = Date.now()

      if (endTouchTimestamp - firstTouch.current.timestamp > timeDelta) {
        return
      }

      const changeX = endTouch.clientX - firstTouch.current.x
      const changeY = endTouch.clientY - firstTouch.current.y

      const absX = Math.abs(changeX)
      const absY = Math.abs(changeY)

      const isDisallowedX =
        e.target instanceof HTMLElement &&
        e.target.closest('[data-swipe-horizontal=false]')
      const isDisallowedY =
        e.target instanceof HTMLElement &&
        e.target.closest('[data-swipe-vertical=false]')

      if (!isDisallowedX && changeX > 0 && changeX > touchDelta) {
        if (onHorizontal) {
          onHorizontal()
        } else {
          onLeftToRight?.()
        }
      } else if (!isDisallowedX && changeX < 0 && absX > touchDelta) {
        if (onHorizontal) {
          onHorizontal()
        } else {
          onRightToLeft?.()
        }
      }

      if (!isDisallowedY && changeY > 0 && changeY > touchDelta) {
        if (onVertical) {
          onVertical()
        } else {
          onTopToBottom?.()
        }
      } else if (!isDisallowedY && changeY < 0 && absY > touchDelta) {
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
