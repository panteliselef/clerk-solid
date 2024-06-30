import type { SessionResource, SetActive } from '@clerk/types'

import { useClerk } from './use-clerk'
import { createMemo } from 'solid-js'
import { csrStore } from 'src/stores'

type UseSessionListReturn =
  | {
      isLoaded: false
      sessions: undefined
      setActive: undefined
    }
  | {
      isLoaded: true
      sessions: SessionResource[]
      setActive: SetActive
    }

export const useSessionList = () => {
  const clerk = useClerk()
  const client = csrStore.client

  return createMemo<UseSessionListReturn>(() => {
    if (!client) {
      return { isLoaded: false, sessions: undefined, setActive: undefined }
    }

    return {
      isLoaded: true,
      sessions: client.sessions,
      setActive: clerk()!.setActive,
    }
  })
}
