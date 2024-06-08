import { Component } from 'solid-js'
import { parsePublishableKey } from '@clerk/shared/keys'
import { createScriptLoader } from './script-loader'
import { ClerkOptions, ClientResource, LoadedClerk, Without } from '@clerk/types'

const publishableKey = 'xxxx'

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

function buildClerkHotloadScript() {
  return clerkJsScriptUrl({
    publishableKey,
  })
}

export interface HeadlessBrowserClerk extends LoadedClerk {
  load: (opts?: Without<ClerkOptions, 'isSatellite'>) => Promise<void>
  updateClient: (client: ClientResource) => void
}

declare global {
  interface Window {
    Clerk: HeadlessBrowserClerk
  }
}

export const Clerk: Component<{}> = props => {
  createScriptLoader({
    src: buildClerkHotloadScript(),
    // src: 'https://js.lclclerk.com/npm/clerk.browser.js',
    'data-clerk-publishable-key': publishableKey,
    async onLoad() {
      const clerkJSInstance = window.Clerk
      await window.Clerk.load()


      // TODO: add nano stores solid
      // TODO: Create google one tap for solid
      clerkJSInstance.addListener((payload) => {
        $csrState.setKey('client', payload.client);
        $csrState.setKey('user', payload.user);
        $csrState.setKey('session', payload.session);
        $csrState.setKey('organization', payload.organization);
      });

    },
  })

  return null
}
