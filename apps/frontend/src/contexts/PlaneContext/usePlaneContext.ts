'use client'

'use client'

import panzoom, { type PanZoom } from 'panzoom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ApiReturnType } from '@/types/globals'
import type { api } from '@/api/trpc'
import { useIsMounted } from '@/shared/hooks/useIsMounted'
import throttle from 'lodash.throttle'
import { usePlaneApi } from './usePlaneApi'
import { randomInt } from '@/shared/functions/randomInt'
import { planeStore } from '@/stores/plane.store'
import { postStore } from '@/stores/post.store'
import { useFluid } from '@/shared/hooks/useFluid'

type ApiPosts = ApiReturnType<typeof api.post.public.getFeed.query>

export type PlaneProps = {
  firstData: ApiPosts
  limit: number
}

type Posts = (ApiPosts[0] & { pos: { x: number; y: number } })[]

type Chunk = {
  pos: {
    x: number
    y: number
  }
  data: Posts | null
}

export const usePlaneContext = (props: PlaneProps) => {
  const { firstData, limit } = props

  const CHUNKS_LIMIT = 5
  const POSTS_LIMIT = limit
  const ZOOM_STEP = 0.25
  const GRID_SCALE = 50
  const CHUNK_WIDTH = useFluid(800, 1500)
  const CHUNK_HEIGHT = useFluid(800, 1500)
  const COLUMN_PADDING = useFluid(150, 250)

  const getPositionedPosts = (data: ApiPosts): Posts => {
    const colsWidth = CHUNK_HEIGHT / data.length

    return data.map((p, i) => {
      const x = randomInt(colsWidth * i, colsWidth * (i + 1) - COLUMN_PADDING)
      const y = randomInt(0, CHUNK_HEIGHT - COLUMN_PADDING * 1.5)

      return {
        ...p,
        pos: { x, y }
      }
    })
  }

  const getChunkKey = ({ x, y }: { x: number; y: number }) => {
    return `${x};${y}`
  }

  const firstPos = { x: 0, y: 0 }
  const firstChunk: Chunk = useMemo(() => {
    return {
      pos: firstPos,
      data: getPositionedPosts(firstData)
    }
  }, [])

  const [chunks, setChunks] = useState<Chunk[]>([firstChunk])

  const panzoomInstance = useRef<PanZoom | null>(null)
  const isDragging = useRef(false)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const renderedChunks = useRef(new Set([getChunkKey(firstPos)]))
  const lastProcessedChunk = useRef(firstPos)

  const { isMounted } = useIsMounted()
  const { getFeed } = usePlaneApi()

  const onGetFeedComplete = ({
    data,
    x,
    y
  }: {
    data: ApiReturnType<typeof api.post.public.getFeed.query>
    x: number
    y: number
  }) => {
    const newChunk = {
      pos: { x, y },
      data: getPositionedPosts(data)
    }

    renderedChunks.current = new Set(
      [...renderedChunks.current].slice(CHUNKS_LIMIT * -1)
    )

    setChunks((prev) => [...prev.slice(CHUNKS_LIMIT * -1), newChunk])
  }

  // initialization
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const instance = panzoom(canvasRef.current, {
      minZoom: 0.75,
      maxZoom: 1.5,
      zoomSpeed: 0.05,
      zoomDoubleClickSpeed: 1,
      onTouch: () => {
        return false
      }
    })

    panzoomInstance.current = instance
    instance.moveTo(
      CHUNK_WIDTH / -2 + window.innerWidth / 2,
      CHUNK_HEIGHT / -2 + window.innerHeight / 2
    )

    instance.on('panstart', () => {
      isDragging.current = true
    })

    instance.on('panend', () => {
      requestAnimationFrame(() => {
        isDragging.current = false
      })
    })

    instance.on('transform', () => {
      if (!gridRef.current) {
        return
      }

      const transform = instance.getTransform()

      gridRef.current.style.backgroundPosition = `${transform.x}px ${transform.y}px`
      gridRef.current.style.backgroundSize = `${GRID_SCALE * transform.scale}px ${GRID_SCALE * transform.scale}px`
      planeStore.setScale(transform.scale)
    })

    return () => {
      instance.dispose()
    }
  }, [])

  // chunk procession
  useEffect(() => {
    if (!panzoomInstance.current) {
      return
    }

    const instance = panzoomInstance.current
    const xCenter = window.innerWidth / 2
    const yCenter = window.innerHeight / 2

    const onTransform = throttle(() => {
      const transform = instance.getTransform()

      const currentPosX =
        (transform.x - xCenter) / CHUNK_WIDTH / transform.scale
      const currentPosY =
        (transform.y - yCenter) / CHUNK_HEIGHT / transform.scale

      const flooredPosX = Math.ceil(currentPosX)
      const flooredPosY = Math.ceil(currentPosY)

      if (
        lastProcessedChunk.current.x === flooredPosX &&
        lastProcessedChunk.current.y === flooredPosY
      ) {
        return
      }

      lastProcessedChunk.current = { x: flooredPosX, y: flooredPosY }
      planeStore.setCurrentChunk(flooredPosX, flooredPosY)

      const chunkKey = getChunkKey({ x: flooredPosX, y: flooredPosY })

      if (!renderedChunks.current.has(chunkKey)) {
        renderedChunks.current.add(chunkKey)

        getFeed({
          limit: POSTS_LIMIT,
          onComplete: (data) => {
            onGetFeedComplete({ data, x: flooredPosX, y: flooredPosY })
          }
        })
      }
    }, 200)

    instance.on('transform', onTransform)

    return () => {
      instance.dispose()
    }
  }, [])

  const zoomIn = useCallback(() => {
    if (!panzoomInstance.current) {
      return
    }

    const prevZoom = panzoomInstance.current.getTransform().scale

    panzoomInstance.current.smoothZoomAbs(
      window.innerWidth / 2,
      window.innerHeight / 2,
      prevZoom + ZOOM_STEP
    )
  }, [])

  const zoomOut = useCallback(() => {
    if (!panzoomInstance.current) {
      return
    }

    const prevZoom = panzoomInstance.current.getTransform().scale

    panzoomInstance.current.smoothZoomAbs(
      window.innerWidth / 2,
      window.innerHeight / 2,
      prevZoom - ZOOM_STEP
    )
  }, [])

  const onClick = useCallback(
    (id: string) => {
      if (!isDragging.current) {
        postStore.open(id)
      }
    },
    [isDragging.current]
  )

  return {
    gridRef,
    canvasRef,
    isMounted,
    chunks,
    CHUNK_WIDTH,
    CHUNK_HEIGHT,
    isDragging,
    zoomIn,
    zoomOut,
    onClick
  }
}

export type PlaneContextValue = ReturnType<typeof usePlaneContext>
