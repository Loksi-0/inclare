'use client'

import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/api/tanstack'
import gsap from 'gsap'
import { randomInt } from '@/shared/functions/randomInt'
import { darkenColor } from '@/shared/functions/darkenColor'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEventHandler
} from 'react'
import { normalizeHex } from '@/shared/functions/normalizeHex'
import { soundStore } from '@/stores/sound.store'

export type LikeProps = {
  postId: string
  color: string
  likes?: number
  isLiked?: boolean
}

export const useLike = (props: LikeProps) => {
  const {
    postId,
    color,
    likes: initialLikes,
    isLiked: initialIsLiked = false
  } = props

  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likes, setLikes] = useState(initialLikes)

  const outlineRef = useRef<SVGPathElement | null>(null)
  const groupRef = useRef<SVGGElement | null>(null)

  const clipId = useId()
  const trpc = useTRPC()
  const { mutate: toggleLike } = useMutation(
    trpc.post.toggleLike.mutationOptions()
  )

  const PIXEL_SIZE = 4
  const VIEW_BOX_X = 23
  const VIEW_BOX_Y = 19
  const PIXEL_COLORS = ['#DD3F3F', '#ED2540', '#FF4548', '#FA3030']

  const pixelsData = useMemo(() => {
    const result: { id: string; x: number; y: number; fill: string }[] = []

    const rows = Math.ceil(VIEW_BOX_X / PIXEL_SIZE) + 2
    const cols = Math.ceil(VIEW_BOX_Y / PIXEL_SIZE) + 2

    for (let i = 0; i < cols + rows; i++) {
      for (let a = 0; a < i + 1; a++) {
        const pixelX = PIXEL_SIZE * (i - a)
        const pixelY = VIEW_BOX_Y - PIXEL_SIZE * (a + 1)

        if (
          pixelX > VIEW_BOX_X ||
          pixelY > VIEW_BOX_Y ||
          pixelX < 0 - PIXEL_SIZE ||
          pixelY < 0 - PIXEL_SIZE
        ) {
          continue
        }

        result.push({
          id: `${pixelX}-${pixelY}`,
          x: pixelX,
          y: pixelY,
          fill: PIXEL_COLORS[randomInt(0, PIXEL_COLORS.length - 1)]
        })
      }
    }

    return result
  }, [])

  useEffect(() => {
    setLikes(initialLikes)
    setIsLiked(initialIsLiked)
  }, [postId, initialLikes, initialIsLiked])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isLiked) {
        if (!outlineRef.current || !groupRef.current) {
          return
        }

        gsap.to(outlineRef.current, {
          stroke: darkenColor(color, 30),
          duration: 0.2
        })

        if (groupRef.current && groupRef.current.children.length > 0) {
          const pixels = Array.from(groupRef.current.children)

          const DURATION = 0.2

          gsap.set(groupRef.current, { opacity: 1 })

          const tl = gsap.timeline()
          tl.fromTo(
            pixels,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              stagger: {
                amount: DURATION,
                from: 'start'
              },
              ease: 'power1.out'
            }
          )
          tl.to(
            pixels,
            {
              fill: normalizeHex(color),
              duration: 0.2,
              stagger: {
                amount: DURATION,
                from: 'start'
              },
              ease: 'power1.out',
              onComplete: () => {
                tl.kill()
              }
            },
            DURATION / 1.2
          )
        }
      } else {
        gsap.to(outlineRef.current, {
          stroke: 'var(--color-dark)',
          duration: 0.2
        })

        gsap.to(groupRef.current, {
          opacity: 0,
          duration: 0.2
        })
      }
    })

    return () => {
      ctx.revert()
    }
  }, [color, isLiked])

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!isLiked) {
      e.stopPropagation()
      soundStore.onLike()
    }

    setLikes((prev) =>
      typeof prev === 'number' ? (!isLiked ? prev + 1 : prev - 1) : undefined
    )
    setIsLiked((prev) => !prev)

    toggleLike(
      { id: postId },
      {
        onSuccess: (d) => {
          setLikes(d.likesCount)
          setIsLiked(d.isLiked)
        }
      }
    )
  }

  return {
    VIEW_BOX_X,
    PIXEL_SIZE,
    VIEW_BOX_Y,
    clipId,
    outlineRef,
    groupRef,
    pixelsData,
    likes,
    onClick
  }
}
