import { Component } from 'solid-js'
import { parsePublishableKey } from '@clerk/shared/keys'
import { createScriptLoader } from './script-loader'
import { ClerkOptions, MultiDomainAndOrProxy, SDKMetadata, Without } from '@clerk/types'
import { $csrState } from './stores'

export type IsomorphicClerkOptions = Without<ClerkOptions, 'isSatellite'> & {
  // Clerk?: ClerkProp;
  clerkJSUrl?: string
  clerkJSVariant?: 'headless' | ''
  clerkJSVersion?: string
  sdkMetadata?: SDKMetadata
  publishableKey: string
} & MultiDomainAndOrProxy

export type ClerkProviderProps = IsomorphicClerkOptions & {
  // children: React.ReactNode;
  // initialState?: InitialState;
}

type BuildClerkJsScriptOptions = {
  clerkJSUrl?: string
  clerkJSVariant?: 'headless' | ''
  clerkJSVersion?: string
  publishableKey: string
}

const clerkJsScriptUrl = (opts: BuildClerkJsScriptOptions) => {
  const { clerkJSUrl, clerkJSVariant, publishableKey } = opts

  if (clerkJSUrl) {
    return clerkJSUrl
  }

  let scriptHost = ''
  scriptHost = parsePublishableKey(publishableKey)?.frontendApi || ''

  const variant = clerkJSVariant ? `${clerkJSVariant.replace(/\.+$/, '')}.` : ''
  const version = '5'
  return `https://${scriptHost}/npm/@clerk/clerk-js@${version}/dist/clerk.${variant}browser.js`
}

function buildClerkHotloadScript(options: BuildClerkJsScriptOptions) {
  return clerkJsScriptUrl(options)
}

export const Clerk: Component<ClerkProviderProps> = props => {
  createScriptLoader({
    src: buildClerkHotloadScript(props),
    // src: 'https://js.lclclerk.com/npm/clerk.browser.js',
    'data-clerk-publishable-key': props.publishableKey,
    async onLoad() {
      const clerkJSInstance = window.Clerk
      await window.Clerk.load()
      $csrState.setKey('isLoaded', true)

      // TODO: add nano stores solid
      // TODO: Create google one tap for solid
      clerkJSInstance.addListener(payload => {
        $csrState.set({
          isLoaded: true,
          client: payload.client,
          user: payload.user,
          session: payload.session,
          organization: payload.organization,
        })
        // $csrState.setKey('client', payload.client)
        // $csrState.setKey('user', payload.user)
        // $csrState.setKey('session', payload.session)
        // $csrState.setKey('organization', payload.organization)
      })
    },
  })

  return null
}
