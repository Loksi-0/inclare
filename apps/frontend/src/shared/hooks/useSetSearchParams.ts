import type { ReadonlyURLSearchParams } from 'next/navigation'

export const useSetSearchParams = (
  searchParams: ReadonlyURLSearchParams,
  pathname: string
) => {
  const setSearchParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)

    const url = `${pathname}?${params.toString()}`

    window.history.pushState(null, '', url)
  }

  const clearSearchParams = () => {
    window.history.pushState(null, '', pathname)
  }

  return {
    setSearchParams,
    clearSearchParams
  }
}
