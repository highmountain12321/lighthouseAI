/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { googleLogin, register } from '../core/_requests'
import { Link, useNavigate } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { PasswordMeterComponent } from '../../../../_metronic/assets/ts/components'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
// import {useAuth} from '../core/Auth'

// Firebase Imports
import { auth } from '../../../../firebase'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { useSnackbar } from 'notistack'
import { useAuthState } from 'react-firebase-hooks/auth'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // For Loading
  const [user, loadingAuth, errorAuth] = useAuthState(auth)

  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  // const {saveAuth, setCurrentUser} = useAuth()
  const googleLoginSubmit = async () => {
    setLoading(true)
    try {
      const data = await googleLogin()
      window.location.assign(data.data)
      // const {data} = await getUser(accessToken)
      // saveAuth(data)
      // setCurrentUser(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting, setErrors }) => {
      setLoading(true)
      setHasError(undefined)
      try {
        // const {data: message} = await register(
        //   values.email,
        //   values.firstname,
        //   values.lastname,
        //   values.password,
        //   values.changepassword
        // )
        // setStatus(message.message)
        // setTimeout(() => {
        //   navigate('/auth/verify-otp', {state: {email: values.email}})
        // }, 2500)
        // setHasError(false)
        // setSubmitting(false)
        // setLoading(false)

        const email = values.email
        const password = values.password

        // console.log('Email ==> ', email)
        // console.log('Password ==> ', password)

        // Register the user
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user
            // ...

            if (auth.currentUser) {
              // Set the first and last name of the user
              updateProfile(auth.currentUser, {
                displayName: `${values.firstname} ${values.lastname}`,
              })
                .then(() => {
                  // Profile updated!
                  // ...

                  enqueueSnackbar('Registration Successful', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                      horizontal: "right",
                      vertical: "bottom"
                    }
                  })

                  // Redirect to the dashboard
                  // navigate('/dashboard', { state: { email: values.email } })
                  navigate('/auth/verify-email')
                })
                .catch((error) => {
                  // An error occurred
                  // ...
                })
            }

            // set loading to false
            setLoading(false)
            setSubmitting(false)
            setHasError(false)
            setStatus('Registration Successful')
          })
          .catch((error) => {
            const errorCode = error.code
            let errorMessage = "";
            
            if (errorCode === 'auth/email-already-in-use') {
              errorMessage = "The email is already in use."
              setTimeout(() => {
                navigate('/auth/login');
              }, 1000)
            } else {
              console.error('An error occurred:', error.message);
              errorMessage = error.message;
            }
            

            console.error(error)
            setHasError(true)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)

            enqueueSnackbar(`Registration Failed : ${errorMessage}`, {
              variant: 'error',
              autoHideDuration: 3000,
              anchorOrigin: {
                horizontal: "right",
                vertical: "bottom"
              }
            })
            // ..
          })
      } catch (error) {
        console.error(error)
        setHasError(true)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)

        // if (axios.isAxiosError(error) && error.response?.data.errors) {
        //   setErrors(error.response.data.errors)
        // }
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
        {/* end::Title */}

        <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div>
      </div>
      {/* end::Heading */}

      {/* begin::Login options */}
      <div className='row g-3 mb-9'>
        {/* begin::Col */}
        <div className='col-md-12'>
          {/* begin::Google link */}
          {/* <button
            onClick={googleLoginSubmit}
            type='button'
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
              className='h-15px me-3'
            />
            Sign in with Google
          </button> */}
          {/* end::Google link */}
        </div>
        {/* end::Col */}

        {/* begin::Col */}
        {/* <div className='col-md-6'>
          {/* begin::Google link
          <a
            href='#'
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/apple-black.svg')}
              className='theme-light-show h-15px me-3'
            />
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/apple-black-dark.svg')}
              className='theme-dark-show h-15px me-3'
            />
            Sign in with Apple
          </a>
          {/* end::Google link
        </div> */}
        {/* end::Col */}
      </div>
      {/* end::Login options */}

      <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
      </div>

      {formik.status && (
        <div className={`mb-lg-15 alert ${hasError ? 'alert-danger' : 'alert-info'}`}>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}
      {/* begin::Form group Firstname */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>First name</label>
        <input
          placeholder='First name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('firstname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.firstname && formik.errors.firstname,
            },
            {
              'is-valid': formik.touched.firstname && !formik.errors.firstname,
            }
          )}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      <div className='fv-row mb-8'>
        {/* begin::Form group Lastname */}
        <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
        <input
          placeholder='Last name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('lastname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.lastname && formik.errors.lastname,
            },
            {
              'is-valid': formik.touched.lastname && !formik.errors.lastname,
            }
          )}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.lastname}</span>
            </div>
          </div>
        )}
        {/* end::Form group */}
      </div>

      {/* begin::Form group Email */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Password'
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <span>
            I Accept the{' '}
            <a href='/auth/terms' target='_blank' className='ms-1 link-primary'>
              Terms
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Cancel
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}
