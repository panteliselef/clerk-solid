import type { OrganizationMembershipResource, OrganizationResource } from '@clerk/types'

import { useClerk } from './use-clerk'
import { csrStore } from 'src/stores'
import { useUser } from './use-user'
import { createMemo } from 'solid-js'

type UseOrganizationReturn =
  | {
      isLoaded: false
      organization: undefined
      membership: undefined
    }
  | {
      isLoaded: true
      organization: OrganizationResource
      membership: undefined
    }
  | {
      isLoaded: boolean
      organization: OrganizationResource | null
      membership: OrganizationMembershipResource | null | undefined
    }

export const useOrganization = () => {
  const organization = csrStore.organization
  const user = useUser()

  const clerk = useClerk()

  return createMemo<UseOrganizationReturn>(() => {
    if (organization === undefined) {
      return {
        isLoaded: false,
        organization: undefined,
        membership: undefined,
      }
    }

    if (organization === null) {
      return {
        isLoaded: true,
        organization: null,
        membership: null,
      }
    }

    /** In SSR context we include only the organization object when loadOrg is set to true. */
    if (!clerk()?.loaded) {
      return {
        isLoaded: true,
        organization,
        membership: undefined,
      }
    }

    return {
      isLoaded: clerk()?.loaded || false,
      organization,
      membership: getCurrentOrganizationMembership(
        user().user!.organizationMemberships,
        organization.id,
      ), // your membership in the current org
    }
  })
}

function getCurrentOrganizationMembership(
  organizationMemberships: OrganizationMembershipResource[],
  activeOrganizationId: string,
) {
  return organizationMemberships.find(
    organizationMembership => organizationMembership.organization.id === activeOrganizationId,
  )
}
