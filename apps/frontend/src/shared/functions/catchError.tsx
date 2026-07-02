import type { JSX } from 'react'

export const catchError = (
  Component: (...props: any) => Promise<JSX.Element> | null,
  ErrorComponent: () => JSX.Element | null
) => {
  return async (props: any) => {
    try {
      return await Component(props)
    } catch {
      return <ErrorComponent />
    }
  }
}
