'use client'

import { api } from '@/shared/api/trpc'
import { defineErrorMessage } from '@/shared/functions/defineErrorMessage'
import { toast } from '@/features/toast'
import type { ApiReturnType } from '@/shared/types/globals'

type GetFeedOnComplete = (
  data: ApiReturnType<typeof api.feed.getFeed.query>
) => void

type GetFeedOpts = {
  onComplete: GetFeedOnComplete
  limit?: number
}

export const usePlaneApi = () => {
  const getFeed = (opts: GetFeedOpts) => {
    api.feed.getFeed
      .query({ limit: opts.limit })
      .then((d) => {
        opts.onComplete(d)
      })
      .catch((e: Error) => {
        toast.error(defineErrorMessage(e.message))
      })
  }

  return { getFeed }
}
