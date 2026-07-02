import { Context, useContext } from 'react'

export const useCustomContext = <T>(customContext: Context<T | null>): T => {
  const context = useContext(customContext)

  if (!context) {
    throw new Error('Контекст должен использоваться внутри провайдера')
  }

  return context
}
