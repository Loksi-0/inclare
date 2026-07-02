import { useEffect, useState } from 'react'

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const onMount = () => {
      setIsMounted(true)
    }

    onMount()
  }, [])

  return {
    isMounted
  }
}
