export type InputMode =
  'email' | 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'url'

export type ApiReturnType<T extends () => void> = Awaited<ReturnType<T>>
