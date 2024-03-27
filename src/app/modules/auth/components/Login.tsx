import clsx from 'clsx'
import * as Yup from 'yup'
import { useFormik } from 'formik'
// import {useAuth} from '../core/Auth'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getUser, login, sendGoogleAuthCode } from '../core/_requests'
import ReCAPTCHA from 'react-google-recaptcha'
import Cookies from 'js-cookie'

// Firebase Imports
import { auth } from '../../../../firebase'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithRedirect
} from 'firebase/auth'
import { useAuth } from '../core/Auth'
import axios from 'axios'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // For Loading
  const [userAuth, loadingAuth, errorAuth] = useAuthState(auth)
  const { saveAuth, setCurrentUser } = useAuth()

  const [captcha, setCaptcha] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Assuming 'user' is a state variable or a prop passed to the component
      if (userAuth) {
        // console.log('User @ In Login User ==> ', userAuth)

        const token = userAuth.refreshToken
        const refreshToken = userAuth.refreshToken

        saveAuth(token.toString())

        const accessToken = await userAuth.getIdToken()
        Cookies.set('gid_token', accessToken)

        setLoading(false)
        // navigate('/dashboard') // Replace '/dashboard' with the actual path you want to navigate to
      } else {
        // console.log('User is null')
      }
    }

    fetchUserDetails() // Call the fetchUserDetails function
  }, [])

  // Google Logins
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result: any = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token: any = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      saveAuth(token.toString());

      console.log("Google login user ==> ", user)

      const accessToken = await user.getIdToken(true);
      Cookies.set('gid_token', accessToken);
      setCurrentUser(user as any);

      enqueueSnackbar("User signed In using Google successfully", {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });

      setLoading(false);


      // console.log("user signed In", user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      enqueueSnackbar(`Error Signing In using Google : ${errorMessage}`, {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      // ...
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const serverAuthCode = urlParams.get('code')
    if (serverAuthCode) {
      sendAuthCodeToServer(serverAuthCode)
    }
  }, [])
  const sendAuthCodeToServer = async (serverAuthCode: string) => {
    setLoading(true)
    try {
      const { data } = await sendGoogleAuthCode(serverAuthCode)
      const user = data.user
      const token = data.token
      const refreshToken = data.refreshToken
      saveAuth(token)
      setCurrentUser(user)
      setLoading(false)
    } catch (error) {
      console.error(error)
      saveAuth('')
      setLoading(false)
    }
  }
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const email = values.email
        const password = values.password

        if (email !== '' && password !== '') {
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          // Signed up
          const user = userCredential.user
          const accessToken = await user.getIdToken()
          setCurrentUser(user as any)

          const token = user.refreshToken
          const refreshToken = user.refreshToken

          // saveAuth(token)

          setLoading(false)
          // navigate('/dashboard')
          if (user.emailVerified) {
            navigate('/dashboard')
          } else {
            navigate('/auth/verify-email')
          }
        } else {
          enqueueSnackbar('Please fill all the fields', {
            variant: 'error',
            autoHideDuration: 3000,
          })
        }
      } catch (error: any) {
        console.error(error)
        saveAuth('')
        enqueueSnackbar(`The login details are incorrect : ${error.message}`, {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        })
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>Sign In With</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div>
      </div>

      <div className='row g-3 mb-9'>
        <div className='col-md-12'>
          <button
            onClick={handleGoogleLogin}
            type='button'
            title={true ? 'Coming soon' : ''}
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
              className='h-15px me-3'
            />
            Sign in with Google
          </button>
        </div>
      </div>

      <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
      </div>

      {formik.status && (
        <div className='mb-lg-8 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>

      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
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

      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link>
      </div>

      {/* <ReCAPTCHA
        sitekey='6LfuH2IpAAAAAFvjkbV7Zwk_obBxWnM8FM6G2JCm'
        onChange={setCaptcha}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      /> */}

      <div className='d-grid mb-10 mt-6'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
export default Login
