import type { ActiveSessionResource } from '@clerk/types'
import { createMemo } from 'solid-js'
import { csrStore } from 'src/stores'

type UseSessionReturn =
  | { isLoaded: false; isSignedIn: undefined; session: undefined }
  | { isLoaded: true; isSignedIn: false; session: null }
  | { isLoaded: true; isSignedIn: true; session: ActiveSessionResource }

/**
 * Returns the current auth state and if a user is signed in, the user object.
 *
 * Until Clerk loads and initializes, `isLoaded` will be set to `false`.
 * Once Clerk loads, `isLoaded` will be set to `true`, and you can
 * safely access `isSignedIn` state and `user`.
 *
 * @example
 * A simple example:
 *
 * import { useSession } from 'clerk-solid'
 *
 * function SessionExample() {
 *   const session = useSession();
 *   return (
 *      <Show when={session().session} keyed>
 *        {session => <div>Session id: {session.id}</div>}
 *      </Show>
 *   )
 * }
 */
export function useSession() {
  return createMemo<UseSessionReturn>(() => {
    const session = csrStore.session

    if (session === undefined) {
      return { isLoaded: false, isSignedIn: undefined, session: undefined }
    }

    if (session === null) {
      return { isLoaded: true, isSignedIn: false, session: null }
    }

    return { isLoaded: true, isSignedIn: true, session }
  })
}
