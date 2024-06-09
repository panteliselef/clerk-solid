import {
  CreateOrganizationProps,
  OrganizationListProps,
  OrganizationProfileProps,
  OrganizationSwitcherProps,
  SignInProps,
  SignUpProps,
  UserButtonProps,
  UserProfileProps,
} from '@clerk/types'
import { Component, createEffect, createSignal, onCleanup } from 'solid-js'
import { clerk } from 'src/stores'

export interface MountProps {
  mount: ((node: HTMLDivElement, props: any) => void) | undefined
  unmount: ((node: HTMLDivElement) => void) | undefined
  updateProps?: (props: any) => void
  props?: any
  // TODO: Support custom Pages
  customPagesPortals?: any[]
}

const UIPortal: Component<MountProps> = props => {
  const [myRef, setRef] = createSignal<HTMLDivElement>()

  createEffect(() => {
    // TODO: Support props
    props.mount?.(myRef()!, {})
  })

  onCleanup(() => {
    props.unmount?.(myRef()!)
  })

  return <div ref={setRef} />
}

const SignIn: Component<SignInProps> = () => {
  return <UIPortal mount={clerk()?.mountSignIn} unmount={clerk()?.unmountSignIn} />
}

const SignUp: Component<SignUpProps> = () => {
  return <UIPortal mount={clerk()?.mountSignUp} unmount={clerk()?.unmountSignUp} />
}

const UserButton: Component<UserButtonProps> = () => {
  return <UIPortal mount={clerk()?.mountUserButton} unmount={clerk()?.unmountUserButton} />
}

const UserProfile: Component<UserProfileProps> = () => {
  return <UIPortal mount={clerk()?.mountUserProfile} unmount={clerk()?.unmountUserProfile} />
}

const OrganizationProfile: Component<OrganizationProfileProps> = () => {
  return (
    <UIPortal
      mount={clerk()?.mountOrganizationProfile}
      unmount={clerk()?.unmountOrganizationProfile}
    />
  )
}

const OrganizationSwitcher: Component<OrganizationSwitcherProps> = () => {
  return (
    <UIPortal
      mount={clerk()?.mountOrganizationSwitcher}
      unmount={clerk()?.unmountOrganizationSwitcher}
    />
  )
}

const OrganizationList: Component<OrganizationListProps> = () => {
  return (
    <UIPortal mount={clerk()?.mountOrganizationList} unmount={clerk()?.unmountOrganizationList} />
  )
}

const CreateOrganization: Component<CreateOrganizationProps> = () => {
  return (
    <UIPortal
      mount={clerk()?.mountCreateOrganization}
      unmount={clerk()?.unmountCreateOrganization}
    />
  )
}

export {
  SignIn,
  SignUp,
  UserButton,
  UserProfile,
  OrganizationProfile,
  OrganizationSwitcher,
  OrganizationList,
  CreateOrganization,
}
