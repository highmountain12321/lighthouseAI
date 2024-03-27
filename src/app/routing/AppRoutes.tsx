/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { FC, Suspense, useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import { App } from '../App'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth as authFirebase } from '../../firebase'
import axios from 'axios'
import apiEndpoints from 'app/axios/jwtDefaultConfig'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(authFirebase)
  const { logout } = useAuth()
  const [redirectDelayComplete, setRedirectDelayComplete] = useState(false)
  const [isSessionCreated, setIsSessionCreated] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
        if (user && user.emailVerified) {
            try {
                const accessToken = await user.getIdToken();
                const apiUrl = apiEndpoints.session
          
                // Send access token to backend to exchange for session cookie
                const response = await axios.post(apiUrl, {}, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                      'credentials': 'include'
                  }
                });
      
                if (response.status === 200) {
                  const delay = setTimeout(() => {
                    setRedirectDelayComplete(true);
                  }, 1000);
                
                  return () => clearTimeout(delay);
              } else {
                  throw new Error('Failed to authenticate');
              }
            } catch (error) {
                console.error("Error:", error);
                setIsSessionCreated(true);
                logout()
            }
        }
    };

    fetchData();
}, [user]);

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {!loadingAuth && (
            <>
              {user && user.emailVerified && !isSessionCreated ? (
                redirectDelayComplete && (
                  <>
                    <Route path='/*' element={<PrivateRoutes />} />
                    <Route index element={<Navigate to='/dashboard' />} />
                  </>
                )
              ) : (
                <>
                  <Route path='auth/*' element={<AuthPage />} />
                  <Route path='*' element={<Navigate to='/auth/login' />} />
                </>
              )}
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }