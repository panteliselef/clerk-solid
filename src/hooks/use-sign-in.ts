import type { SetActive, SignInResource } from '@clerk/types'

import { useClerk } from './use-clerk'
import { createMemo } from 'solid-js'
import { csrStore } from 'src/stores'

type UseSignInReturn =
  | {
      isLoaded: false
      signIn: undefined
      setActive: undefined
    }
  | {
      isLoaded: true
      signIn: SignInResource
      setActive: SetActive
    }

export const useSignIn = () => {
  const clerk = useClerk()
  const client = csrStore.client

  return createMemo<UseSignInReturn>(() => {
    if (!client) {
      return { isLoaded: false, signIn: undefined, setActive: undefined }
    }

    return {
      isLoaded: true,
      signIn: client.signIn,
      setActive: clerk()!.setActive,
    }
  })
}
