import { Show, createSignal, type Component } from 'solid-js'
import { A } from '@solidjs/router'
import logo from './logo.svg'
import styles from './App.module.css'
import { Hello, Clerk, useAuth, UserProfile, UserButton, ClerkLoaded } from 'src'

const App: Component = () => {
  const [show, setShow] = createSignal(false)
  const auth = useAuth()

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />

        <ClerkLoaded>
          <h1>
            <Hello />
          </h1>
        </ClerkLoaded>

        <Show when={auth().isSignedIn} fallback={<div>logged out</div>}>
          <div>logged in</div>
        </Show>

        <UserButton />

        <button onClick={() => setShow(prev => !prev)}>Toogle</button>

        <Show when={show()} fallback={'oh noe'}>
          nice
          <UserProfile />
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
