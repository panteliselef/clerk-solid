import { Component, createEffect, createSignal } from 'solid-js'
import { clerk } from 'src/stores'

const UserProfile: Component = () => {
  const [myRef, setRef] = createSignal<HTMLDivElement>()

  createEffect(() => {
    clerk()?.mountUserProfile(myRef()!)
  })

  return <div ref={setRef} />
}

export { UserProfile }
