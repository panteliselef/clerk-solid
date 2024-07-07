function getContextEnvVar(envVarName: keyof ImportMeta['env']): string | undefined {
  return import.meta.env[envVarName]
}

function getSafeEnv() {
  return {
    domain: getContextEnvVar('VITE_CLERK_DOMAIN'),
    isSatellite: getContextEnvVar('VITE_CLERK_IS_SATELLITE') === 'true',
    proxyUrl: getContextEnvVar('VITE_CLERK_PROXY_URL'),
    publishableKey: getContextEnvVar('VITE_CLERK_PUBLISHABLE_KEY'),
    secretKey: getContextEnvVar('CLERK_SECRET_KEY'),
    signInUrl: getContextEnvVar('VITE_CLERK_SIGN_IN_URL'),
    signUpUrl: getContextEnvVar('VITE_CLERK_SIGN_UP_URL'),
    signInForceRedirectUrl: getContextEnvVar('VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL'),
    signUpForceRedirectUrl: getContextEnvVar('VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL'),
    signInFallbackRedirectUrl: getContextEnvVar('VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL'),
    signUpFallbackRedirectUrl: getContextEnvVar('VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL'),
    clerkJsUrl: getContextEnvVar('VITE_CLERK_JS_URL'),
    clerkJsVariant: getContextEnvVar('VITE_CLERK_JS_VARIANT') as 'headless' | '' | undefined,
    clerkJsVersion: getContextEnvVar('VITE_CLERK_JS_VERSION'),

    // apiVersion: getContextEnvVar('CLERK_API_VERSION'),
    // apiUrl: getContextEnvVar('CLERK_API_URL'),
  }
}

/**
 * This should be used in order to pass environment variables from the server safely to the client.
 * When running an application with `wrangler pages dev` client side environment variables are not attached to `import.meta.env.*`
 * This is not the case when deploying to cloudflare pages directly
 * This is a way to get around it.
 */
function getClientSafeEnv() {
  return {
    domain: getContextEnvVar('VITE_CLERK_DOMAIN'),
    isSatellite: getContextEnvVar('VITE_CLERK_IS_SATELLITE') === 'true',
    proxyUrl: getContextEnvVar('VITE_CLERK_PROXY_URL'),
    signInUrl: getContextEnvVar('VITE_CLERK_SIGN_IN_URL'),
    signUpUrl: getContextEnvVar('VITE_CLERK_SIGN_UP_URL'),
  }
}

export { getSafeEnv, getClientSafeEnv }
