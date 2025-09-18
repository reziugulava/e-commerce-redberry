import { useEffect, type PropsWithChildren } from 'react'
import { useUserStore } from '../stores/user'

export function AuthProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    useUserStore.getState().initializeFromStorage()
  }, [])

  return children
}
