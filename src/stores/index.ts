import type {
  ActiveSessionResource,
  ClientResource,
  InitialState,
  OrganizationResource,
  UserResource,
} from '@clerk/types'
import { atom, map, computed } from 'nanostores'
import { deriveState } from './utils'
import { HeadlessBrowserClerk } from 'src/types'
import { createStore } from 'solid-js/store'
import { createMemo, createSignal } from 'solid-js'

export const $csrState = map<{
  isLoaded: boolean
  client: ClientResource | undefined | null
  user: UserResource | undefined | null
  session: ActiveSessionResource | undefined | null
  organization: OrganizationResource | undefined | null
}>({
  isLoaded: false,
  client: null,
  user: null,
  session: null,
  organization: null,
})

export const $initialState = map<InitialState>()

export const $clerk = atom<HeadlessBrowserClerk | null>(null)

export const $authStore = computed([$csrState, $initialState], (state, initialState) => {
  return deriveState(
    state.isLoaded,
    {
      session: state.session,
      user: state.user,
      organization: state.organization,
      client: state.client!,
    },
    initialState,
  )
})

export type CSRStore = {
  isLoaded: boolean
  client: ClientResource | undefined | null
  user: UserResource | undefined | null
  session: ActiveSessionResource | undefined | null
  organization: OrganizationResource | undefined | null
}

const [csrStore, setCsrStore] = createStore<CSRStore>({
  isLoaded: false,
  client: null,
  user: null,
  session: null,
  organization: null,
})

const authStore = createMemo(() => {
  return deriveState(
    csrStore.isLoaded,
    {
      session: csrStore.session,
      user: csrStore.user,
      organization: csrStore.organization,
      client: csrStore.client!,
    },
    undefined,
  )
})

const [clerk, setClerk] = createSignal<HeadlessBrowserClerk | null>(null)

export { csrStore, setCsrStore, authStore, clerk, setClerk }
