import { ParentComponent, Show, createEffect } from 'solid-js'
import { A } from '@solidjs/router'
import { Clerk, SignedIn, SignedOut, UserButton, useAuth } from 'src'

const RootLayout: ParentComponent = props => {
  const auth = useAuth()
  createEffect(() => {
    console.log('Auth:', auth())
  })
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
      <Clerk />
      {props.children}
    </>
  )
}

export { RootLayout }
