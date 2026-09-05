'use client'

import { useFluid } from '@/shared/hooks/useFluid'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import { onboardingStore } from '../onboarding'
import { soundStore } from '@/shared/stores/sound.store'
import { timelineStore } from './timeline.store'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import InertiaPlugin from 'gsap/InertiaPlugin'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'

export type Post = {
  id: string
  previewUrl?: string
  createdAt: Date
  pcs: number
}

export const useTimeline = (data: Post[]) => {
  gsap.registerPlugin(Draggable, InertiaPlugin)

  const BASE_STEP = useFluid(0.6, 2.5)
  const LEFT_PADDING = useFluid(50, 200)
  const RIGHT_PADDING = useFluid(100, 300)
  const POST_SIZE = useFluid(150, 300)
  const GROUP_THRESHOLD = useFluid(20, 100)

  const { isMounted } = useIsMounted()
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const lastRef = useRef<HTMLDivElement | null>(null)
  const wasPositionSet = useRef(false)

  const daysSinceEpoch = (date: Date) => {
    return Math.floor(date.getTime() / 86400000)
  }

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )
  }, [data])

  const lastPostDay = useMemo(() => {
    const lastPost = sortedData.at(-1)

    if (!lastPost) {
      return 0
    }

    return daysSinceEpoch(lastPost.createdAt)
  }, [sortedData])

  const firstYearsPosts = useMemo(() => {
    const years = new Set<number>()
    const result = new Set<string>()

    sortedData.forEach((p) => {
      const year = p.createdAt.getFullYear()

      if (!years.has(year)) {
        years.add(year)
        result.add(p.id)
      }
    })

    return result
  }, [sortedData])

  const groups = useMemo(() => {
    const res: Post[][] = []

    sortedData.forEach((p, i, arr) => {
      const lastGroup = res.at(-1)
      const prev = arr.at(i - 1)

      const pushGroup = (el: Post) => {
        res.push([el])
      }

      const pushLast = (el: Post) => {
        if (!lastGroup) {
          pushGroup(el)
          return
        }

        lastGroup.push(el)
      }

      if (!prev || !lastGroup) {
        pushGroup(p)
        return
      }

      const isNextYear =
        prev.createdAt.getFullYear() + 1 === p.createdAt.getFullYear()
      const dayDiff =
        (daysSinceEpoch(p.createdAt) - daysSinceEpoch(prev.createdAt)) *
        BASE_STEP

      if (isNextYear) {
        pushLast(p)
        return
      }

      if (dayDiff > POST_SIZE * lastGroup.length + GROUP_THRESHOLD) {
        pushGroup(p)
      } else {
        pushLast(p)
      }
    })

    return res
  }, [sortedData])

  const groupsPos = useMemo(() => {
    return groups.map((g) => {
      const lastGroupPost = g.at(-1)

      if (!lastGroupPost) {
        return 0
      }

      return (
        (lastPostDay - daysSinceEpoch(lastGroupPost.createdAt)) * BASE_STEP * -1
      )
    })
  }, [sortedData, BASE_STEP])

  const getMinX = () => {
    const firstPos = groupsPos.at(0)

    if (!firstPos) {
      return 0
    }

    return firstPos * -1 + LEFT_PADDING
  }

  const getMaxX = () => {
    if (!lastRef.current) {
      return 0
    }

    const lastWidth = lastRef.current.getBoundingClientRect().width
    const maxX = lastWidth - window.innerWidth + RIGHT_PADDING

    return maxX * -1
  }

  useEffect(() => {
    if (sortedData.at(0)) {
      onboardingStore.openTimeline()
    }
  }, [sortedData])

  useLayoutEffect(() => {
    if (!timelineRef.current) {
      return
    }

    timelineStore.timelineRef = timelineRef.current

    if (!wasPositionSet.current) {
      gsap.set(bodyRef.current, { x: getMaxX() })
    }

    const draggableInstance = Draggable.create(bodyRef.current, {
      type: 'x',
      dragResistance: 0,
      edgeResistance: 0.8,
      inertia: true,
      bounds: {
        minX: getMinX(),
        maxX: getMaxX()
      },
      trigger: timelineRef.current
    }).at(0)

    const onMove = () => {
      if (!draggableInstance) {
        return
      }

      wasPositionSet.current = true
      soundStore.onScroll(draggableInstance.x, 20)
    }

    draggableInstance?.addEventListener('move', onMove)
    draggableInstance?.addEventListener('throwupdate', onMove)

    return () => {
      draggableInstance?.kill()
      draggableInstance?.removeEventListener('move', onMove)
      draggableInstance?.removeEventListener('throwupdate', onMove)
    }
  }, [sortedData, isMounted])

  return {
    timelineRef,
    bodyRef,
    lastRef,
    groups,
    lastPostDay,
    daysSinceEpoch,
    groupsPos,
    sortedData,
    firstYearsPosts,
    isMounted
  }
}
