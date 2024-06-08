import { ClerkOptions, ClientResource, LoadedClerk, Without } from '@clerk/types'

declare global {
  interface Window {
    Clerk: HeadlessBrowserClerk
  }
}

export interface HeadlessBrowserClerk extends LoadedClerk {
  load: (opts?: Without<ClerkOptions, 'isSatellite'>) => Promise<void>
  updateClient: (client: ClientResource) => void
}
