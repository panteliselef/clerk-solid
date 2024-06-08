import type {
  ActJWTClaim,
  CheckAuthorizationWithCustomPermissions,
  Clerk,
  GetToken,
  LoadedClerk,
  OrganizationCustomRoleKey,
  SignOut,
} from '@clerk/types'
import { useStore } from '@nanostores/solid'
import { Accessor, createEffect, createMemo } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { $authStore, $clerk, $csrState, authStore, csrStore } from 'src/stores'
import { deriveState, deriveFromSsrInitialState, deriveFromClientSideState } from 'src/stores/utils'

type CheckAuthorizationSignedOut = undefined
type CheckAuthorizationWithoutOrgOrUser = (
  params?: Parameters<CheckAuthorizationWithCustomPermissions>[0],
) => false

/**
 * @internal
 */
const clerkLoaded = () => {
  return new Promise<Clerk>(resolve => {
    $csrState.subscribe(({ isLoaded }) => {
      if (isLoaded) resolve($clerk.get()!)
    })
  })
}

/**
 * @internal
 */
const createGetToken = () => {
  return async (options: any) => {
    const clerk = await clerkLoaded()
    if (!clerk.session) {
      return null
    }
    return clerk.session.getToken(options)
  }
}

/**
 * @internal
 */
const createSignOut = () => {
  return async (...args: any) => {
    const clerk = await clerkLoaded()
    return clerk.signOut(...args)
  }
}

type UseAuthReturn =
  | {
      isLoaded: false
      isSignedIn: undefined
      userId: undefined
      sessionId: undefined
      actor: undefined
      orgId: undefined
      orgRole: undefined
      orgSlug: undefined
      has: CheckAuthorizationSignedOut
      // signOut: SignOut
      // getToken: GetToken
    }
  | {
      isLoaded: true
      isSignedIn: false
      userId: null
      sessionId: null
      actor: null
      orgId: null
      orgRole: null
      orgSlug: null
      has: CheckAuthorizationWithoutOrgOrUser
      // signOut: SignOut
      // getToken: GetToken
    }
  | {
      isLoaded: true
      isSignedIn: true
      userId: string
      sessionId: string
      actor: ActJWTClaim | null
      orgId: null
      orgRole: null
      orgSlug: null
      has: CheckAuthorizationWithoutOrgOrUser
      // signOut: SignOut
      // getToken: GetToken
    }
  | {
      isLoaded: true
      isSignedIn: true
      userId: string
      sessionId: string
      actor: ActJWTClaim | null
      orgId: string
      orgRole: OrganizationCustomRoleKey
      orgSlug: string | null
      has: CheckAuthorizationWithCustomPermissions
      // signOut: SignOut
      // getToken: GetToken
    }

/**
 * Returns the current auth state, the user and session ids and the `getToken`
 * that can be used to retrieve the given template or the default Clerk token.
 *
 * Until Clerk loads, `isLoaded` will be set to `false`.
 * Once Clerk loads, `isLoaded` will be set to `true`, and you can
 * safely access the `userId` and `sessionId` variables.
 *
 * For projects using a server, you can have immediate access to this data during SSR.
 *
 * @example
 * A simple example:
 *
 * function Hello() {
 *   const auth = useAuth();
 *   return <Show when={auth().isSignedIn} />
 * }
 *
 * @example
 * This page will be fully rendered during SSR:
 *
 * export HelloPage = () => {
 *   const auth = useAuth();
 *   createEffect(() => console.log(auth().isSignedIn, auth().userId))
 *   return <div>...</div>
 * }
 */
// : UseAuthReturn
export const useAuth = (): Accessor<UseAuthReturn> => {
  // const auth = useStore($authStore)

  // const getToken: GetToken = useCallback(createGetToken(), [])
  // const signOut: SignOut = useCallback(createSignOut(), [])

  const has = (params: Parameters<CheckAuthorizationWithCustomPermissions>[0]) => {
    const userId = authStore().userId
    const orgId = authStore().orgId
    const orgRole = authStore().orgRole
    const orgPermissions = authStore().orgPermissions

    if (!params?.permission && !params?.role) {
      throw new Error(
        'Missing parameters. `has` from `useAuth` requires a permission or role key to be passed. Example usage: `has({permission: "org:posts:edit"`',
      )
    }

    if (!orgId || !userId || !orgRole || !orgPermissions) {
      return false
    }

    if (params.permission) {
      return orgPermissions.includes(params.permission)
    }

    if (params.role) {
      return orgRole === params.role
    }

    return false
  }

  return createMemo<UseAuthReturn>(() => {
    const sessionId = authStore().sessionId
    const userId = authStore().userId
    const orgId = authStore().orgId
    const orgRole = authStore().orgRole
    const actor = authStore().actor
    const orgSlug = authStore().orgSlug

    if (sessionId === undefined && userId === undefined) {
      return {
        isLoaded: false,
        isSignedIn: undefined,
        sessionId,
        userId,
        actor: undefined,
        orgId: undefined,
        orgRole: undefined,
        orgSlug: undefined,
        has: undefined,
        // signOut,
        // getToken,
      }
    }

    if (sessionId === null && userId === null) {
      return {
        isLoaded: true,
        isSignedIn: false,
        sessionId,
        userId,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: () => false,
        // signOut,
        // getToken,
      }
    }

    if (!!sessionId && !!userId && !!orgId && !!orgRole) {
      return {
        isLoaded: true,
        isSignedIn: true,
        sessionId,
        userId,
        actor: actor || null,
        orgId: orgId,
        orgRole: orgRole,
        orgSlug: orgSlug || null,
        has,
        // signOut,
        // getToken,
      }
    }

    if (!!sessionId && !!userId && !orgId) {
      return {
        isLoaded: true,
        isSignedIn: true,
        sessionId,
        userId,
        actor: actor || null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: () => false,
        // signOut,
        // getToken,
      }
    }

    throw new Error('Invalid state. Feel free to submit a bug or reach out to support')
  })
}
