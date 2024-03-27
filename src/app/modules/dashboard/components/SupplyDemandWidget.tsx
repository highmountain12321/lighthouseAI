/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '_metronic/assets/ts/_utils'
import { useThemeMode } from '_metronic/partials/layout/theme-mode/ThemeModeProvider'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import { getDemandRates, getSupplies, getSupplyRates } from 'app/redux/thunks/dashboardThunk'

type Props = {
  className: string,
  type: "supply" | "demand",
}
export type TimeFrameTypes = 'Year' | 'Month' | 'Week'
const SupplyDemandWidget: React.FC<Props> = ({ className, type }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const dispatch = useAppDispatch()
  const activeButtonStyle = "btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1";
  const defaultButtonStyle = "btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1";

  const [activeBtn, setActiveBtn] = React.useState<TimeFrameTypes>('Year'); // Initially, Year is active
  let seriesData: any;

  const handleButtonClick = (btn: TimeFrameTypes) => {
    setActiveBtn(btn);
  }

  const supplyRates: any = useAppSelector(state => state.dashboard.supplyRates)
  const demandRates: any = useAppSelector(state => state.dashboard.demandRates)
  if (type === "supply") {
    seriesData = (supplyRates) // TODO: ask backend for supply rate
  } else if (type === "demand") {
    seriesData = (demandRates) // TODO: ask backend for demand rate
  }
  const getButtonStyle = (btn: string) => {
    return activeBtn === btn ? activeButtonStyle : defaultButtonStyle;
  }

  const refreshMode = () => {
    if (!chartRef.current) {
      return
    }

    if (!seriesData) {
      return
    }
    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, seriesData, type))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const fetchData = async () => {
      if (type === "supply") {
        await dispatch(getSupplyRates())
      } else if (type === "demand") {
        await dispatch(getDemandRates())
      }
    }
    fetchData()
  }, [activeBtn])

  useEffect(() => {
    const chart = refreshMode()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, seriesData])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{type == "supply" ? "Supply Rate" : "Demand Rate"}</span>

          <span className='text-muted fw-semibold fs-7'>More than 1000 new data</span>
        </h3>

        {/* begin::Toolbar */}
        <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className={getButtonStyle("Year")}
            id='kt_charts_widget_3_year_btn'
            onClick={() => handleButtonClick("Year")}
          >
            Year
          </a>

          <a
            className={getButtonStyle("Month")}
            id='kt_charts_widget_3_month_btn'
            onClick={() => handleButtonClick("Month")}
          >
            Month
          </a>

          <a
            className={getButtonStyle("Week")}
            id='kt_charts_widget_3_week_btn'
            onClick={() => handleButtonClick("Week")}
          >
            Week
          </a>
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{ height: '350px' }}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export { SupplyDemandWidget }


const getChartOptions = (height: number, seriesData: any, type: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const baseColor = getCSSVariableValue('--bs-info');
  const lightColor = getCSSVariableValue('--bs-info-light');

  // Modify this part to use the correct data structure
  let valuesArray: number[] = type === 'supply' ? seriesData.num_projects : seriesData.num_sales;
  const totalValueArray: number[] = type === 'supply' ? seriesData.total_value : seriesData.total_amount;

  // Calculate min and max from the valuesArray
  let minValue = Math.min(...valuesArray);
  let maxValue = Math.max(...valuesArray);

  return {
    series: [
      {
        name: type === "supply" ? 'Number of Projects' : 'Number of Sales',
        data: valuesArray,
      },
      {
        name: type === "supply" ? 'Total Value' : 'Total Amount',
        data: totalValueArray,
      },
      {
        name: 'Average',
        data: [minValue, maxValue],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: height ?? 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: seriesData.area, // Use area names as labels
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
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: minValue * 0.7,
      max: maxValue * 1.1,
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
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
        formatter: function (val) {
          return '$' + val + ' thousands';
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  };
};
