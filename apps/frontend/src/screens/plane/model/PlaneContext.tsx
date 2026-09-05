'use client'

import {
  usePlaneContext,
  type PlaneProps,
  type PlaneContextValue
} from './usePlaneContext'
import { createContext, PropsWithChildren } from 'react'

export const PlaneContext = createContext<PlaneContextValue | null>(null)

type PlaneProviderProps = PropsWithChildren<{
  props: PlaneProps
}>

export const PlaneProvider = ({ children, props }: PlaneProviderProps) => {
  const context = usePlaneContext(props)

  return (
    <PlaneContext.Provider value={context}>{children}</PlaneContext.Provider>
  )
}
