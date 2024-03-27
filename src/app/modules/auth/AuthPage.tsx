import { useEffect } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { Registration } from './components/Registration'
import { ForgotPassword } from './components/ForgotPassword'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { ResetPassword } from './components/ResetPassword'
import OtpInputWithValidation from './components/OtpInputWithValidation'
import EmailVerification from "./components/EmailVerification"
import { Terms } from './components/Terms'
import Login from './components/Login'

const AuthLayout = () => {
  useEffect(() => {
    document.body.style.backgroundImage = 'none'
    return () => { }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        <a href='#' className='mb-12'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/default-dark.svg')}
            className='theme-dark-show h-45px'
          />
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/default.svg')}
            className='theme-light-show h-45px'
          ></img>
        </a>

        <div className='w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto'>
          <Outlet />
        </div>
      </div>

      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-semibold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='terms' element={<Terms />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='reset-password' element={<ResetPassword />} />
      <Route path='verify-otp' element={<OtpInputWithValidation />} />
      <Route path='verify-email' element={<EmailVerification />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export { AuthPage }
