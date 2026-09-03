import { useTRPC } from '@/api/tanstack'
import { UI } from '@/constants'
import { PlaneContext } from '@/contexts/PlaneContext'
import { randomInt } from '@/shared/functions/randomInt'
import { useCustomContext } from '@/shared/hooks/useCustomContext'
import { soundStore } from '@/stores/sound.store'
import { useSubscription } from '@trpc/tanstack-react-query'
import { useRef, useState } from 'react'

export const useDeadPixel = () => {
  const { panzoom } = useCustomContext(PlaneContext)

  const [postId, setPostId] = useState<string | null>(null)
  const pixelRef = useRef<HTMLDivElement | null>(null)

  const createPixel = (id: string) => {
    if (!pixelRef.current || !panzoom) {
      return
    }

    setPostId(id)
    soundStore.playPixel()

    const transform = panzoom.getTransform()

    const left = transform.x / transform.scale
    const right = left - window.innerWidth / transform.scale + 100
    const top = transform.y / transform.scale
    const bottom = top - window.innerHeight / transform.scale + 200

    const approxX = randomInt(right, left)
    const approxY = randomInt(bottom, top)

    const pixelX =
      Math.floor(approxX / UI.PLANE_GRID_SCALE) * UI.PLANE_GRID_SCALE * -1
    const pixelY =
      Math.floor(approxY / UI.PLANE_GRID_SCALE) * UI.PLANE_GRID_SCALE * -1

    pixelRef.current.style.transform = `translate(${pixelX}px, ${pixelY}px)`
  }

  const trpc = useTRPC()
  useSubscription(
    trpc.feed.fallingStar.subscriptionOptions(undefined, {
      onData: (d) => {
        createPixel(d)
      }
    })
  )

  return {
    postId,
    pixelRef
  }
}
