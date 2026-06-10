'use client'

import { api } from '@/api/trpc'
import { useEffect } from 'react'

const TestPage = () => {
  useEffect(() => {
    const send = async () => {
      try {
        const response = await api.auth.me.query()

        console.log(response)
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message)
        }
      }
    }

    void send()
  }, [])

  return null
}

export default TestPage
