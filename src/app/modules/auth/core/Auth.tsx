import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { FirebaseUser } from './_models'
import * as authHelper from './AuthHelpers'
import { WithChildren } from '../../../../_metronic/helpers'
import { useSnackbar } from 'notistack'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth as authFirebase } from '../../../../firebase'
import { getAuth, signOut } from 'firebase/auth'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { isAccessTokenExpired } from './methods'
import { useAppDispatch } from 'app/redux/hooks'
import { getAllConversationContent } from 'app/redux/features/conversation-slice'

type AuthContextProps = {
  auth: string
  saveAuth: (auth: string) => void
  currentUser: FirebaseUser | undefined
  setCurrentUser: Dispatch<SetStateAction<FirebaseUser | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => { },
  currentUser: {} as FirebaseUser,
  setCurrentUser: () => { },
  logout: () => { },
}

const AuthContext = createContext<AuthContextProps>({
  auth: '',
  saveAuth: () => { },
  currentUser: {} as FirebaseUser,
  setCurrentUser: () => { },
  logout: () => { },
})

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [user, loadingAuth, errorAuth] = useAuthState(authFirebase as any)
  const [auth, setAuth] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<FirebaseUser | undefined>()

  const saveAuth = (auth: string) => {
    setAuth(auth)
    if (auth) {
      setCurrentUser(user as FirebaseUser | undefined)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth('')
    setCurrentUser(undefined)

    Cookies.remove('gid_token')

    // Firebase Logout
    signOut(authFirebase)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      })
  }

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const [user, loadingAuth, errorAuth] = useAuthState(authFirebase as any)

  const [localUser, setLocalUser] = useState<any>({} as FirebaseUser)

  useEffect(() => {
    if (user) {
      setLocalUser(user)
    }
  }, [user])

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  let { auth, logout, setCurrentUser } = useAuth()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    if (!auth || Object.keys(auth).length === 0) {
      auth = localUser as any
    }
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          if (localUser) {
            // console.log("USER IN AUTH @ ", user)
            if (localUser.emailVerified) {
              setCurrentUser(localUser as any)

              // navigate('/dashboard', { replace: true })
            } else {
              enqueueSnackbar('Please verify your email', { variant: 'info' })
              navigate('/auth/verify-email')
            }
          }
        }
      } catch (error) {
        console.error(error)
        if (!didRequest.current) {
          // logout()
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (user && !loadingAuth) {
      // This will ensure cookies are set on refresh
      user.getIdToken(true).then((idToken: any) => {
        // alert("Access Token Refreshed New Token: " + idToken)
        Cookies.set('gid_token', idToken)
        // alert("Access Token Refreshed New Token: " + idToken)
        // console.log('Access token is refreshed');
        requestUser()
      })

      // Set interval to refresh the token After 50 minutes
      setInterval(() => {
        user.getIdToken(true).then((idToken: any) => {
          Cookies.set('gid_token', idToken)
          // alert("Access Token Refreshed New Token: " + idToken)
          // console.log('Access token is refreshed');
          requestUser()
        })
      }, 3500000)
      requestUser()
    } else {
      enqueueSnackbar('Log out auth, auth token is not available', { variant: 'info' })
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
