interface InternalEnv {
  readonly VITE_CLERK_FRONTEND_API?: string
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string
  readonly VITE_CLERK_JS_URL?: string
  readonly VITE_CLERK_JS_VARIANT?: 'headless' | ''
  readonly VITE_CLERK_JS_VERSION?: string
  readonly CLERK_API_KEY?: string
  readonly CLERK_API_URL?: string
  readonly CLERK_API_VERSION?: string
  readonly CLERK_JWT_KEY?: string
  readonly CLERK_SECRET_KEY?: string
  readonly VITE_CLERK_DOMAIN?: string
  readonly VITE_CLERK_IS_SATELLITE?: string
  readonly VITE_CLERK_PROXY_URL?: string
  readonly VITE_CLERK_SIGN_IN_URL?: string
  readonly VITE_CLERK_SIGN_UP_URL?: string
  readonly VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL?: string
  readonly VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL?: string
  readonly VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL?: string
  readonly VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL?: string
}

declare global {
  interface ImportMeta {
    env: InternalEnv & {
      NODE_ENV: 'production' | 'development'
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
    }
  }
}

export {}
