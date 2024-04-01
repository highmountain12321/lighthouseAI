/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { KTIcon } from '../../../../_metronic/helpers'
import { getCSSVariableValue } from '../../../../_metronic/assets/ts/_utils'
import { FilterOptions } from './FilterOptions'
import clsx from 'clsx'
import { useThemeMode } from '../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { useAppDispatch } from 'app/redux/hooks'
import {
  getAverageRentals,
  getAverageSales,
  getRentals,
  getSales,
} from 'app/redux/thunks/dashboardThunk'
import { salesAreas, rentalAreas } from './cities'
import { monthsData, yearsData } from './filters'
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  isSaleCard?: boolean
  data: any
  average: number
  mostBoughtArea: string
  mostBoughtProject: string
  mostBoughtPropertyType: string
}

export type FiltersType = {
  country: string
  city: string
  year?: number
  month?: number
  notifications: boolean
}
const MixedWidgetSales: React.FC<Props> = ({
  className,
  chartColor,
  chartHeight,
  data,
  isSaleCard = true,
  average,
  mostBoughtArea,
  mostBoughtProject,
  mostBoughtPropertyType,
}) => {
  const dispatch = useAppDispatch()
  const countries = ['UAE']
  const cities = ['Dubai']
  // const salesAreas = ['Dubai', ]
  const timelines = ['Year', 'Month']
  const initialFilter: FiltersType = {
    country: countries[0],
    city: cities[0],
    year: undefined,
    month: undefined,
    notifications: false,
  }
  const [filters, setFilters] = useState<FiltersType>(initialFilter)
  const [seriesData, setSeriesData] = useState(data?.values || [])
  const [chartMonths, setChartMonths] = useState(data?.months || [])
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const refreshChart = () => {
      if (!chartRef.current || !seriesData || !chartMonths) {
        return null
      }

      const chartPrefix = isSaleCard ? 'Average Sales Price' : 'Average Rentals Price'
      const chart = new ApexCharts(
        chartRef.current,
        chartOptions(chartHeight, seriesData, chartPrefix, chartMonths)
      )
      chart.render()

      return chart
    }

    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [])

  useEffect(() => {
    setSeriesData(data?.values || [])
    setChartMonths(data?.months || [])
  }, [data])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header  */}
      <div className={`card-header border-0 bg-${chartColor} py-5`}>
        <h3 className='card-title fw-bold text-white'>
          {isSaleCard ? 'Sales Fluctuation' : 'Rentals Fluctuation'}
        </h3>

        {/* <RoleLockWrapper locked={true}> */}
        <div className='card-toolbar'>
          {/* begin::Menu  */}
          <button
            type='button'
            className={clsx(
              'btn btn-sm btn-icon btn-color-white btn-active-white',
              `btn-active-color-${chartColor}`,
              'border-0 me-n3'
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <FilterOptions
            countries={countries}
            cities={cities}
            years={
              isSaleCard
                ? yearsData
                : yearsData
            }
            months={monthsData}
            filters={filters}
            type={isSaleCard ? 'sales' : 'rentals'}
            setFilters={setFilters}
          />
          {/* end::Menu  */}
        </div>
        {/* </RoleLockWrapper> */}
      </div>
      {/* end::Header  */}

      {/* begin::Body  */}
      <div className='card-body p-0'>
        {/* begin::Chart  */}
        <div
          ref={chartRef}
          className={`mixed-widget-12-chart card-rounded-bottom bg-${chartColor}`}
        ></div>
        {/* end::Chart  */}

        {/* begin::Stats  */}
        <div className='card-rounded bg-body mt-n10 position-relative card-px py-15'>
          {/* begin::Row  */}
          <div className='row g-0 mb-7'>
            {/* begin::Col  */}
            <div className='col mx-5'>
              <div className='fs-6 text-gray-400'>
                {isSaleCard ? 'Avarage Sale' : 'Avarage Rentals'}
              </div>
              <div className='fs-2 fw-bold text-gray-800'>
                {isSaleCard ? formatter(average ? average : 0) : formatter(average ? average : 0)}
              </div>
            </div>
            {/* end::Col  */}

            {/* begin::Col  */}
            {isSaleCard ? (
              <div className='col mx-5'>
                <div className='fs-6 text-gray-400'>Top Projects</div>
                <div className='fs-2 fw-bold text-gray-800'>
                  {mostBoughtProject ?? 'Peninsular Test'}
                </div>
              </div>
            ) : undefined}
            {/* end::Col  */}
          </div>
          {/* end::Row  */}

          {/* begin::Row  */}
          <div className='row g-0'>
            {/* begin::Col  */}
            <div className='col mx-5'>
              <div className='fs-6 text-gray-400'>Top Areas</div>
              <div className='fs-2 fw-bold text-gray-800'>
                {isSaleCard
                  ? mostBoughtArea ?? 'JUMEIRAH VILLAGE TEST'
                  : mostBoughtArea ?? 'JUMEIRAH VILLAGE TEST'}
              </div>
            </div>
            {/* end::Col  */}

            {/* begin::Col  */}
            <div className='col mx-5'>
              <div className='fs-6 text-gray-400'>Top Property Type</div>
              <div className='fs-2 fw-bold text-gray-800'>
                {isSaleCard ? mostBoughtPropertyType ?? 'unit' : mostBoughtPropertyType ?? 'unit'}
              </div>
            </div>
            {/* end::Col  */}
          </div>
          {/* end::Row  */}
        </div>
        {/* end::Stats  */}
      </div>
      {/* end::Body  */}
    </div>
  )
}

function formatter(val: number) {
  const currency = 'AED'
  if (val >= 1000000) {
    // If value is 1 million or more
    return currency + (val / 1000000).toFixed(2) + 'M'
  } else if (val >= 1000) {
    // If value is 1 thousand or more
    return currency + (val / 1000).toFixed(2) + 'K'
  } else {
    return currency + val // For values less than 1000
  }
}

const chartOptions = (chartHeight: string, seriesData: any, title: string, chartMonths: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  // let valuesArray: number[] = (Object.values(seriesData) as number[]).map(value=>value/100_000)
  let valuesArray: number[] = Object.values(seriesData) as number[]
  // Calculate min and max from the valuesArray
  let minValue = Math.min(...valuesArray)
  let maxValue = Math.max(...valuesArray)

  // console.log('********seriesData********', seriesData)
  // console.log('********Obj(seriesData)********', Object.keys(seriesData))

  return {
    series: [
      {
        name: title,
        data: valuesArray,
      },
      // {
      //   name: 'Revenue',
      //   data: [40, 70, 80, 60, 50, 65, 60],
      // },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      // categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      categories: chartMonths,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: minValue - (maxValue - minValue) * 0.3,
      max: maxValue + (maxValue - minValue) * 0.01,
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: ['solid'],
      opacity: [1],
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: formatter,
      },
      marker: {
        show: false,
      },
    },
    colors: ['#ffffff'],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        left: 20,
        right: 20,
      },
    },
  }
}

export { MixedWidgetSales }
