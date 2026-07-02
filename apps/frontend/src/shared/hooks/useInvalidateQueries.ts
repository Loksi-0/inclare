'use client'

import { useQueryClient } from '@tanstack/react-query'

export const useInvalidateQueries = (queryKey: unknown[]) => {
  const queryClient = useQueryClient()

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey })
  }

  return invalidateQueries
}
