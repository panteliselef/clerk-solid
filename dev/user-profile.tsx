import { type Component } from 'solid-js'
import styles from './App.module.css'
import { UserProfile } from 'src'

const UserProfilePage: Component = () => {
  return (
    <div class={styles.App}>
      <UserProfile routing="path" path="/user" />
    </div>
  )
}

export { UserProfilePage }
