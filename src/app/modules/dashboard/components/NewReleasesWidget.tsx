/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '_metronic/helpers'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import { getTrendingProjects } from 'app/redux/thunks/dashboardThunk'

type Props = {
  className: string
}
interface Item {
  ["Project Name"]: string,
  ["Developer Name"]: string,
  ["Project Status"]: string,
  Area: string
}
type TrendingProjectsData = {
  project: string[];
  previous_month_volume: number[];
  this_month_volume: number[];
  change: number[];
  percentage_change: number[];
}
const NewReleasesWidget: React.FC<Props> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [activeBtn, setActiveBtn] = useState<string>('year')
  const handleButtonClick = (btn: string) => {
    setActiveBtn(btn)
  }
  const newReleases = useAppSelector(state => state.dashboard.latestReleases) as TrendingProjectsData | null;
  useEffect(() => {
    dispatch(getTrendingProjects())
  }, [activeBtn])

  // const tableBody = newReleases?.latestReleases.map(item=>{
  //   let random = Math.floor(6 * Math.random());
  //   if (random == 0) random =1

  //   let imagePath = `/media/projects-images/projects-images (${random}).png`
  //   return <tr key={item["Developer Name"]+item["Project Name"]}>
  //   <td>
  //     <div className='symbol symbol-45px me-2'>
  //       <span className='symbol-label'>
  //         <img
  //           src={toAbsoluteUrl(imagePath)}
  //           className='h-50 align-self-center'
  //           alt=''
  //         />
  //       </span>
  //     </div>
  //   </td>
  //   <td>
  //     <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
  //       {item["Project Name"]}
  //     </a>
  //     <span className='text-muted fw-semibold d-block'>{item["Developer Name"]}</span>
  //   </td>
  //   <td className='text-end text-muted fw-semibold'>{item["Area"]}</td>
  //   <td className='text-end'>
  //     <span className='badge badge-light-success'>{item["Project Status"]}</span>
  //   </td>
  //   <td className='text-end'>
  //     <a
  //       href='#'
  //       className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
  //     >
  //       <KTIcon iconName='arrow-right' className='fs-2' />
  //     </a>
  //   </td>
  // </tr>
  // })
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Trending Projects</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Latest projects that has been released</span>
        </h3>
        <div className='card-toolbar'>
          <ul className='nav'>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                data-bs-toggle='tab'
                onClick={() => handleButtonClick("year")}
              >
                Year
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                data-bs-toggle='tab'
                onClick={() => handleButtonClick("month")}
              >
                Month
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4'
                data-bs-toggle='tab'
                onClick={() => handleButtonClick("week")}
              >
                Week
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          {/* begin::Tap pane */}
          <div className='tab-pane fade show active' id='kt_table_widget_5_tab_1'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='border-0'>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-140px'></th>
                    <th className='p-0 min-w-110px'></th>
                    <th className='p-0 min-w-50px'></th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {/* {tableBody} */}
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
        </div>
      </div>
      {/* end::Body */}
    </div>
  )
}

export { NewReleasesWidget }
