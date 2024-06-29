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
    props.mount?.(myRef()!, props.props)
  })

  onCleanup(() => {
    props.unmount?.(myRef()!)
  })

  return <div ref={setRef} />
}

const SignIn: Component<SignInProps> = props => {
  return <UIPortal mount={clerk()?.mountSignIn} unmount={clerk()?.unmountSignIn} props={props} />
}

const SignUp: Component<SignUpProps> = props => {
  return <UIPortal mount={clerk()?.mountSignUp} unmount={clerk()?.unmountSignUp} props={props} />
}

const UserButton: Component<UserButtonProps> = props => {
  return (
    <UIPortal mount={clerk()?.mountUserButton} unmount={clerk()?.unmountUserButton} props={props} />
  )
}

const UserProfile: Component<UserProfileProps> = props => {
  return (
    <UIPortal
      mount={clerk()?.mountUserProfile}
      unmount={clerk()?.unmountUserProfile}
      props={props}
    />
  )
}

const OrganizationProfile: Component<OrganizationProfileProps> = props => {
  return (
    <UIPortal
      mount={clerk()?.mountOrganizationProfile}
      unmount={clerk()?.unmountOrganizationProfile}
      props={props}
    />
  )
}

const OrganizationSwitcher: Component<OrganizationSwitcherProps> = props => {
  return (
    <UIPortal
      mount={clerk()?.mountOrganizationSwitcher}
      unmount={clerk()?.unmountOrganizationSwitcher}
      props={props}
    />
  )
}

const OrganizationList: Component<OrganizationListProps> = props => {
  return (
    <UIPortal
      mount={clerk()?.mountOrganizationList}
      unmount={clerk()?.unmountOrganizationList}
      props={props}
    />
  )
}

const CreateOrganization: Component<CreateOrganizationProps> = props => {
  return (
    <UIPortal
      mount={clerk()?.mountCreateOrganization}
      unmount={clerk()?.unmountCreateOrganization}
      props={props}
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
