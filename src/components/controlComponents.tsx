import { ParentComponent, Show } from 'solid-js'
import { useAuth } from 'src/hooks'
import { clerk } from 'src/stores'

const SignedIn: ParentComponent = props => {
  const auth = useAuth()
  return <Show when={auth().isSignedIn}>{props.children}</Show>
}

const SignedOut: ParentComponent = props => {
  const auth = useAuth()
  return <Show when={!auth().isSignedIn}>{props.children}</Show>
}

const ClerkLoaded: ParentComponent = props => {
  return <Show when={clerk()?.loaded}>{props.children}</Show>
}

export { SignedIn, SignedOut, ClerkLoaded }
