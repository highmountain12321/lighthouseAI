import React from 'react'
import { ProfileDetails } from './cards/ProfileDetails'
import { SignInMethod } from './cards/SignInMethod'
import { ConnectedAccounts } from './cards/ConnectedAccounts'
import { EmailPreferences } from './cards/EmailPreferences'
import { Notifications } from './cards/Notifications'
import { DeactivateAccount } from './cards/DeactivateAccount'
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper'

export function Settings() {
  return (
    <>
      <ProfileDetails />
   {/*    <SignInMethod /> */}
      <ConnectedAccounts />
     {/*  <RoleLockWrapper locked={true}>
        <EmailPreferences />
      </RoleLockWrapper>
      <RoleLockWrapper locked={true}>
        <Notifications />
      </RoleLockWrapper>
      <RoleLockWrapper locked={true}>
        <DeactivateAccount />
      </RoleLockWrapper> */}
    </>
  )
}
