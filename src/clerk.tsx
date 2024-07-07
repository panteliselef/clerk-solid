import type { ClerkOptions, MultiDomainAndOrProxy, SDKMetadata, Without } from '@clerk/types'
import type { Component } from 'solid-js'
import { createDevOrStagingUrlCache, parsePublishableKey } from '@clerk/shared/keys'
import { handleValueOrFn } from '@clerk/shared/handleValueOrFn'
import { reconcile } from 'solid-js/store'
import { useNavigate } from '@solidjs/router'
import { addClerkPrefix } from '@clerk/shared/url'
import { isValidProxyUrl, proxyUrlToAbsoluteURL } from '@clerk/shared/proxy'

import { CSRStore, setClerk, setCsrStore } from './stores'
import { createScriptLoader } from './script-loader'
import { getSafeEnv } from './utils/get-env'

export type IsomorphicClerkOptions = Without<ClerkOptions, 'isSatellite'> & {
  // Clerk?: ClerkProp;
  clerkJSUrl?: string
  clerkJSVariant?: 'headless' | ''
  clerkJSVersion?: string
  sdkMetadata?: SDKMetadata
  publishableKey?: string
} & MultiDomainAndOrProxy

export type ClerkProviderProps = IsomorphicClerkOptions & {
  // children: React.ReactNode;
  // initialState?: InitialState;
}

type BuildClerkJsScriptOptions = {
  proxyUrl: string
  domain: string
  clerkJSUrl?: string
  clerkJSVariant?: 'headless' | ''
  clerkJSVersion?: string
  publishableKey: string
}
const { isDevOrStagingUrl } = createDevOrStagingUrlCache()

const clerkJsScriptUrl = (opts: BuildClerkJsScriptOptions) => {
  const { clerkJSUrl, clerkJSVariant, clerkJSVersion, proxyUrl, domain, publishableKey } = opts

  if (clerkJSUrl) {
    return clerkJSUrl
  }

  let scriptHost = ''
  if (!!proxyUrl && isValidProxyUrl(proxyUrl)) {
    scriptHost = proxyUrlToAbsoluteURL(proxyUrl).replace(/http(s)?:\/\//, '')
  } else if (domain && !isDevOrStagingUrl(parsePublishableKey(publishableKey)?.frontendApi || '')) {
    scriptHost = addClerkPrefix(domain)
  } else {
    scriptHost = parsePublishableKey(publishableKey)?.frontendApi || ''
  }

  const variant = clerkJSVariant ? `${clerkJSVariant.replace(/\.+$/, '')}.` : ''
  const version = clerkJSVersion || '5'
  return `https://${scriptHost}/npm/@clerk/clerk-js@${version}/dist/clerk.${variant}browser.js`
}

function buildClerkHotloadScript(options: BuildClerkJsScriptOptions) {
  return clerkJsScriptUrl(options)
}

export const mergeSolidClerkPropsWithEnv = (props: Omit<ClerkProviderProps, 'children'>) => {
  return {
    ...props,
    publishableKey: props.publishableKey || getSafeEnv().publishableKey || '',
    clerkJSUrl: props.clerkJSUrl || getSafeEnv().clerkJsUrl,
    clerkJSVersion: props.clerkJSVersion || getSafeEnv().clerkJsVersion,
    proxyUrl: props.proxyUrl || getSafeEnv().proxyUrl || '',
    domain: props.domain || getSafeEnv().domain || '',
    isSatellite: props.isSatellite || getSafeEnv().isSatellite,
    signInUrl: props.signInUrl || getSafeEnv().signInUrl || '',
    signUpUrl: props.signUpUrl || getSafeEnv().signUpUrl || '',
    signInForceRedirectUrl:
      props.signInForceRedirectUrl || getSafeEnv().signInForceRedirectUrl || '',
    signUpForceRedirectUrl:
      props.signUpForceRedirectUrl || getSafeEnv().signInForceRedirectUrl || '',
    signInFallbackRedirectUrl:
      props.signInFallbackRedirectUrl || getSafeEnv().signInFallbackRedirectUrl || '',
    signUpFallbackRedirectUrl:
      props.signUpFallbackRedirectUrl || getSafeEnv().signUpFallbackRedirectUrl || '',
    // Not supporting the following as they are deprecated
    // afterSignInUrl: props.afterSignInUrl,
    // afterSignUpUrl: props.afterSignUpUrl,
  }
}

export const Clerk: Component<ClerkProviderProps> = props => {
  const navigate = useNavigate()
  const mergedProps = mergeSolidClerkPropsWithEnv(props)
  const proxyUrlStr = handleValueOrFn(mergedProps.proxyUrl, new URL(window.location.href), '')
  const domainStr = handleValueOrFn(mergedProps.domain, new URL(window.location.href), '')

  // Avoid re-initialization due to HMR
  if (!window.Clerk) {
    createScriptLoader({
      src: buildClerkHotloadScript({
        ...mergedProps,
        proxyUrl: proxyUrlStr,
        domain: domainStr,
      }),
      ...(mergedProps.publishableKey
        ? { 'data-clerk-publishable-key': mergedProps.publishableKey }
        : {}),
      ...(domainStr ? { 'data-clerk-domain': domainStr } : {}),
      ...(proxyUrlStr ? { 'data-clerk-proxy-url': proxyUrlStr } : {}),
      async onLoad() {
        if (!window.Clerk) {
          return
        }

        const clerkJSInstance = window.Clerk

        await clerkJSInstance.load({
          ...mergedProps,
          routerPush: to => navigate(to),
          routerReplace: to => navigate(to, { replace: true }),
        })

        setClerk(clerkJSInstance)

        // TODO: add nano stores solid
        // TODO: Create google one tap for solid
        clerkJSInstance.addListener(payload => {
          setCsrStore(
            reconcile({
              ...payload,
              isLoaded: true,
            } as CSRStore),
          )
        })
      },
    })
  }

  return null
}
