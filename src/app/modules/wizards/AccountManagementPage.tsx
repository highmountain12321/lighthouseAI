import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Vertical } from './components/Vertical'
import { Horizontal } from './components/Horizontal'

const accountManagementPageBreadCrumbs: Array<PageLink> = [
  {
    title: 'Complete Account',
    path: '/accounts/pages/layout/horizontal',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AccountsPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='horizontal'
        element={
          <>
            <PageTitle breadcrumbs={accountManagementPageBreadCrumbs}>Horizontal</PageTitle>
            <Horizontal />
          </>
        }
      />
      <Route
        path='vertical'
        element={
          <>
            <PageTitle breadcrumbs={accountManagementPageBreadCrumbs}>Account Setup</PageTitle>
            <Vertical />
          </>
        }
      />
      <Route index element={
        <>
          <PageTitle breadcrumbs={accountManagementPageBreadCrumbs}>Account Setup</PageTitle>
          <Vertical />
        </>
      }
      />
    </Route>
  </Routes>
)

export default AccountsPage
