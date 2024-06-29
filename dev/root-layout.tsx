import { ParentComponent, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { Clerk, SignedIn, SignedOut, UserButton, useAuth } from 'src'

const RootLayout: ParentComponent = props => {
  const auth = useAuth()
  return (
    <>
      <nav>
        <SignedOut>
          {/* TODO: Replace this with sign in button */}
          <A href="/sign-in">Sign in</A>
        </SignedOut>
        <SignedIn>
          <A href="/user">UserProfile</A>
          <UserButton />
        </SignedIn>
      </nav>
      <Clerk publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} />
      {props.children}
    </>
  )
}

export { RootLayout }
