import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { MasterInit } from '../_metronic/layout/MasterInit'
import { AuthInit } from './modules/auth'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ReduxProvider } from './redux/provider'
import "./globals.css";
import { SnackbarProvider } from 'notistack'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <ReduxProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID!}>
          <I18nProvider>
            <LayoutProvider>
              <AuthInit>
                <SnackbarProvider>
                  <Outlet />
                </SnackbarProvider>
                <MasterInit />
              </AuthInit>
            </LayoutProvider>
          </I18nProvider>
        </GoogleOAuthProvider>
      </ReduxProvider>
    </Suspense>
  )
}

export { App }
