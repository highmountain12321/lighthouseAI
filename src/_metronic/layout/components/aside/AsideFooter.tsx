import { FirebaseUser, useAuth } from 'app/modules/auth'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { HeaderNotificationsMenu, HeaderUserMenu, QuickLinks } from '../../../partials'
import { extractLetters } from 'app/modules/dashboard/components/methods'
import { auth as authFirebase } from '../../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { json } from 'stream/consumers'

const AsideFooter = () => {
  const { logout } = useAuth()

  const [user, loadingAuth, errorAuth] = useAuthState(authFirebase)

  const [localUser, setLocalUser] = useState<any>(
    {} as FirebaseUser
  )

  useEffect(() => {
    if (user) {
      setLocalUser(user)
    }
  }
    , [user])

  return (
    <div
      className='aside-footer d-flex flex-column align-items-center flex-column-auto'
      id='kt_aside_footer'
    >
      {/* begin::Quick links */}
      <div className='d-flex align-items-center mb-2'>
        {/* begin::Menu wrapper */}
        {/* <div
          className='btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light'
          data-kt-menu-trigger='click'
          data-kt-menu-overflow='true'
          data-kt-menu-placement='top-start'
          data-bs-toggle='tooltip'
          data-bs-placement='right'
          data-bs-dismiss='click'
          title='Quick links'
        >
          <KTIcon iconName='element-plus' className='fs-2 text-lg-1' />
        </div> */}
        {/* end::Menu wrapper */}
        <QuickLinks backgroundUrl='/media/misc/pattern-1.jpg' />
      </div>
      {/* end::Quick links */}

      {/* begin::Activities */}
      <div className='d-flex align-items-center mb-3'>
        {/* begin::Drawer toggle */}
        {/* <div
          className='btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light'
          data-kt-menu-trigger='click'
          data-kt-menu-overflow='true'
          data-kt-menu-placement='top-start'
          data-bs-toggle='tooltip'
          data-bs-placement='right'
          data-bs-dismiss='click'
          title='Activity Logs'
          id='kt_activities_toggle'
        >
          <KTIcon iconName='chart-simple' className='fs-2 text-lg-1' />
        </div> */}
        {/* end::drawer toggle */}
      </div>
      {/* end::Activities */}

      {/* begin::Notifications */}
      {/* <div className='d-flex align-items-center mb-2'> */}
      {/* begin::Menu wrapper */}
      {/* <div
          className='btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light'
          data-kt-menu-trigger='click'
          data-kt-menu-overflow='true'
          data-kt-menu-placement='top-start'
          data-bs-toggle='tooltip'
          data-bs-placement='right'
          data-bs-dismiss='click'
          title='Notifications'
        >
          <KTIcon iconName='element-11' className='fs-2 text-lg-1' />
        </div> */}
      {/* end::Menu wrapper */}
      {/* <HeaderNotificationsMenu backgrounUrl='/media/misc/pattern-1.jpg' />
      </div> */}
      {/* end::Notifications */}

      {/* begin::User */}
      <div className='d-flex align-items-center mb-10' id='kt_header_user_menu_toggle'>
        {/* begin::Menu wrapper */}
        <div
          className='cursor-pointer symbol symbol-40px'
          data-kt-menu-trigger='click'
          data-kt-menu-overflow='false'
          data-kt-menu-placement='top-start'
          title='User profile'
        >
          {user ? (
            <img src={user?.photoURL as string} alt='profile picture' />
          ) : (
            <div className='d-flex align-items-center justify-content-center bg-info w-50px h-50px text-white border border-black border-1 rounded-circle text-uppercase'>
              {/* {extractLetters(user?.displayName as string)} */}
              {extractLetters(user!.displayName ?? '')}
            </div>
          )}
        </div>
        {/* end::Menu wrapper */}
        <HeaderUserMenu />
      </div>
      {/* end::User */}
    </div>
  )
}

export { AsideFooter }
