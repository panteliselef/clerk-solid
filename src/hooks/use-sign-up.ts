import type { SetActive, SignUpResource } from '@clerk/types'

import { useClerk } from './use-clerk'
import { createMemo } from 'solid-js'
import { csrStore } from 'src/stores'

type UseSignUpReturn =
  | {
      isLoaded: false
      signUp: undefined
      setActive: undefined
    }
  | {
      isLoaded: true
      signUp: SignUpResource
      setActive: SetActive
    }

export const useSignUp = () => {
  const clerk = useClerk()
  const client = csrStore.client

  return createMemo<UseSignUpReturn>(() => {
    if (!client) {
      return { isLoaded: false, signUp: undefined, setActive: undefined }
    }

    return {
      isLoaded: true,
      signUp: client.signUp,
      setActive: clerk()!.setActive,
    }
  })
}
