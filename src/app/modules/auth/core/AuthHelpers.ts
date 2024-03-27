import Cookies from 'js-cookie'
import { AuthModel } from './_models'

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
    Cookies.set("gid_token", auth.token)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!Cookies.get('gid_token')) {
    return
  }

  try {
    // localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    Cookies.remove('gid_token')
  } catch (error) {
    console.error('AUTH REMOVING GID TOKEN ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth()
      if (auth && auth.token) {
        // @ts-ignore
        config.headers['x-access-token'] = `${auth.token}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY }