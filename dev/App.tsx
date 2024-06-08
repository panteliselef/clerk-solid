import { Show, batch, createEffect, createSignal, type Component } from 'solid-js'
import logo from './logo.svg'
import styles from './App.module.css'
import { Hello, Clerk, useAuth, UserProfile } from 'src'

const App: Component = () => {
  const auth = useAuth()

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <h1>
          <Hello></Hello>
          <Clerk publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} />
        </h1>

        <UserProfile />

        <Show when={auth().isSignedIn} fallback={<div>logged out</div>}>
          <div>logged in</div>
        </Show>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
    </div>
  )
}

export default App
