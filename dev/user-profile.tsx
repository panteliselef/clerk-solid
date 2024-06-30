import { Show, type Component } from 'solid-js'
import styles from './App.module.css'
import { UserProfile, useSession, useUser } from 'src'

const UserProfilePage: Component = () => {
  const user = useUser()
  const session = useSession()
  return (
    <div class={styles.App}>
      <Show when={user().user} keyed>
        {user => <div>Hello, {user.firstName}</div>}
      </Show>

      <Show when={session().session} keyed>
        {session => (
          <>
            <div>Session id: {session.id}</div>
            <div>Last token: {session.lastActiveToken?.getRawString()}</div>
            <div>User firstname: {session.publicUserData.firstName}</div>
          </>
        )}
      </Show>

      <UserProfile routing="path" path="/user" />
    </div>
  )
}

export { UserProfilePage }
