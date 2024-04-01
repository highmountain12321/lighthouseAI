import { FC, ReactNode, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  ListsWidget9,
  MixedWidget3,
  MixedWidgetRents,
  MixedWidget8,
  StatisticsWidget4,
  // TablesWidget5,
  TablesWidget9,
  ChartsWidget3_2,
  MixedWidget1,
} from '../../../_metronic/partials/widgets'
import { useAuth } from 'app/modules/auth'
import { toAbsoluteUrl } from '_metronic/helpers'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import {
  getAverageRentals,
  getAverageSales,
  getMostBoughtArea,
  getMostBoughtProject,
  getMostBoughtPropertyType,
  getMostTrendingAreas,
  getRentals,
  getSales,
  getSupplies,
} from 'app/redux/thunks/dashboardThunk'
import { MixedWidgetSales } from 'app/modules/dashboard/components/MixedWidgetSales'
import { SupplyDemandWidget } from 'app/modules/dashboard/components/SupplyDemandWidget'
import { ActiveProjectsWidget } from 'app/modules/dashboard/components/ActiveProjectsWidget'
import { TrendingAreasWidget } from 'app/modules/dashboard/components/TrendingAreasWidget'
import { NewReleasesWidget } from 'app/modules/dashboard/components/NewReleasesWidget'
import clsx from 'clsx'
import { Mixed } from 'app/modules/widgets/components/Mixed'
import SupplyDemandCard from 'app/modules/dashboard/charts/SupplyDemandCard'
import { getAuth, signOut } from "firebase/auth";
import PopUpModal from './PopUpModal';

const dashboardBreadCrumbs: Array<PageLink> = [
  {
    title: 'Home',
    path: '/dashboard',
    isSeparator: false,
    isActive: false,
  },
]

export const RoleLockWrapper = ({
  children,
  locked,
  onSmall = false,
  showLock = true,
  className,
}: {
  children: ReactNode
  locked: boolean
  onSmall?: boolean
  showLock?: boolean
  className?: string
}) => {
  return (
    <OverlayTrigger
      key='tooltip-coming'
      placement='top'
      overlay={<Tooltip id='tooltip-coming-soon'>Coming soon</Tooltip>}
    >
      <div className={clsx(className, 'position-relative')}>
        {locked && (
          <div
            className='position-absolute top-0 start-0 w-100 h-100 rounded-2 bg-gray-500 opacity-20'
            style={{ zIndex: 1 }}
          ></div>
        )}
        {locked && showLock && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 4,
            }}
          >
            <img
              src={toAbsoluteUrl('/media/custom/lock.png')}
              alt='lock icon'
              style={onSmall ? { width: 16 } : { width: 42, height: 42 }}
            />
          </div>
        )}
        {children}
      </div>
    </OverlayTrigger>
  )
}

const DashboardPage = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // // Simulate checking login status and showing modal
    // if (isLoggedIn) {
    //   setIsModalOpen(true);
    // }
  }, []);

  const handleClose = (): void => {
    setIsModalOpen(false);
  };

  const handleAnswer = (answer: string): void => {
    console.log(answer); // Here you would send the answer to the server
    setIsModalOpen(false); // Optionally close the modal after selecting an answer
  };

  const { currentUser } = useAuth()
  const isPremium = currentUser?.profile?.role == 'paid'
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Fetch all the dashboard datasets
    dispatch(getSales())
    dispatch(getRentals())
    dispatch(getMostTrendingAreas())
    dispatch(getAverageSales())
    dispatch(getAverageRentals())
    dispatch(getMostBoughtArea())
    dispatch(getMostBoughtProject())
    dispatch(getMostBoughtPropertyType())
    // dispatch(getSupplies())
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])
  const sales = useAppSelector((state) => state.dashboard.sales)
  const rentals = useAppSelector((state) => state.dashboard.rentals)

  // average
  const averageSales = useAppSelector((state) => state.dashboard.averageSales?.average_sales_price)
  const averageRentals = useAppSelector(
    (state) => state.dashboard.averageRentals?.average_rent_price
  )

  // most bought area
  const mostBoughtArea = useAppSelector((state) => state.dashboard.mostBoughtArea?.name)

  // most bought project
  const mostBoughtProject = useAppSelector((state) => state.dashboard.mostBoughtProject?.name)

  // most bought property type
  const mostBoughtPropertyType = useAppSelector(
    (state) => state.dashboard.mostBoughtPropertyType?.name
  )

  // console.log('Sales ==> ', sales)
  // console.log('Rentals ==> ', rentals)
  // console.log('Average Sales ==> ', averageSales)
  // console.log('Average Rentals ==> ', averageRentals)
  // console.log('Most Bought Area ==> ', mostBoughtArea)
  // console.log('Most Bought Project ==> ', mostBoughtProject)
  // console.log('Most Bought Property Type ==> ', mostBoughtPropertyType)

  return (
    <>
      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>
        {/* begin::Col */}

        <div className='col-xxl-6'>
          <MixedWidgetSales
            className='card-xl-stretch mb-xl-8'
            chartColor='primary'
            chartHeight='250px'
            isSaleCard={true}
            data={sales}
            average={averageSales}
            mostBoughtArea={mostBoughtArea}
            mostBoughtProject={mostBoughtProject}
            mostBoughtPropertyType={mostBoughtPropertyType}
          />
        </div>
        {/* end::Col */}
        {/* begin::Col */}
        <div className='col-xxl-6'>
          <MixedWidgetSales
            className='card-xl-stretch mb-xl-8'
            chartColor='primary'
            chartHeight='250px'
            isSaleCard={false}
            data={rentals}
            average={averageRentals}
            mostBoughtArea={mostBoughtArea}
            mostBoughtProject={mostBoughtProject}
            mostBoughtPropertyType={mostBoughtPropertyType}
          />
        </div>
        {/* end::Col */}
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row gy-5 g-xl-8 mt-2'>
        {/* begin::Col */}
        <div className='col-xl-6'>
          <SupplyDemandCard className='card-xl-stretch mb-xl-8' color='primary' type='Supply' />
        </div>
        {/* end::Col */}

        {/* begin::Col */}
        <div className='col-xl-6'>
          <SupplyDemandCard className='card-xl-stretch mb-xl-8' color='danger' type='Demand' />
        </div>
        {/* end::Col */}
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row gy-5 g-xl-8 mt-1'>
        {/* begin::Col */}
        {/*
            <div className='col-xxl-4'>
              <SupplyDemandWidget className='card-xl-fixed mb-5 mb-xl-8' type={"supply"} />
              <SupplyDemandWidget className='card-xl-fixed mb-5 mb-xl-8' type={"demand"} /> 
            </div>
          */}
        {/* end::Col */}

        {/* begin::Col */}
        <div className='col-xxl-6'>
          {/* <RoleLockWrapper locked={!isPremium} className='h-100'> */}
          <ActiveProjectsWidget className='card-xxl-stretch mb-xl-8' />
          {/* </RoleLockWrapper> */}
        </div>
        {/* end::Col */}

        {/* begin::Col */}
        <div className='col-xxl-6'>
          {/* <RoleLockWrapper locked={!isPremium} className='h-100'> */}
          <TrendingAreasWidget className='card-xxl-stretch mb-5 mb-xl-8' />
          {/* </RoleLockWrapper> */}
        </div>
        {/* end::Col */}
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      {/* <div className='row gy-5 g-xl-8'> */}
      {/* begin::Col */}
      {/* <div className='col-xxl-4'>
          <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
        </div> */}
      {/* end::Col */}

      {/* begin::Col */}
      {/* <div className='col-xxl-8'>
          <TablesWidget9 className='card-xxl-stretch mb-5 mb-xl-8' />
        </div> */}
      {/* end::Col */}
      {/* </div> */}
      {/* end::Row */}

      {/* begin::Row */}
      {/* <div className='row gy-5 g-xl-8'> */}
      {/* begin::Col */}
      {/* <div className='col-xl-4'>
          <ListsWidget2 className='card-xl-stretch mb-xl-8' />
        </div> */}
      {/* end::Col */}

      {/* begin::Col */}
      {/* <div className='col-xl-4'>
          <ListsWidget6 className='card-xl-stretch mb-xl-8' />
        </div> */}
      {/* end::Col */}
      {/* </div> */}
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 gx-xxl-8'>
        {/* begin::Col */}
        {/* <div className='col-xxl-4'>
          <MixedWidget8
            className='card-xxl-stretch mb-xl-3'
            chartColor='success'
            chartHeight='150px'
          /> */}
        {/* </div> */}
        {/* end::Col */}

        {/* begin::Col */}
        <div className='col-xxl-8'>
          {/* <RoleLockWrapper locked={!isPremium}> */}
          {/* <NewReleasesWidget className='card-xxl-stretch mb-5 mb-xxl-8' /> */}
          {/* </RoleLockWrapper> */}
        </div>
        {/* end::Col */}
      </div>
      {/* end::Row */}
      <div>
      <PopUpModal isOpen={isModalOpen} onClose={handleClose} onAnswer={handleAnswer} />
      {/* Your dashboard content */}
    </div>
    </>
  )
}

const DashboardWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={dashboardBreadCrumbs}>
        {intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      </PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
