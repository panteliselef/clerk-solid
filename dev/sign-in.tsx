import { type Component } from 'solid-js'
import styles from './App.module.css'
import { SignIn } from 'src'

const SignInPage: Component = () => {
  return (
    <div class={styles.App}>
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}

export { SignInPage }
