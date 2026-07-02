'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export const useQueryParams = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const setSearchParams = (name: string, value: string) => {
    if (!value) {
      router.push(pathname)
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    router.push(pathname + '?' + params.toString())
  }

  return {
    searchParams,
    setSearchParams
  }
}
