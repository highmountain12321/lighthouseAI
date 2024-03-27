/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '_metronic/helpers'
import { FilterOptions } from '../FilterOptions'
import { Dropdown1 } from '../../../../../_metronic/partials/content/dropdown/Dropdown1'
import { FiltersType } from '../MixedWidgetSales'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import { getFilterActiveProjects, getMostActiveProjects } from 'app/redux/thunks/dashboardThunk'
import { salesAreas } from '../cities'
import { monthsData, yearsData } from '../filters'
import { convert2ArraysToObjectArray } from '../methods'
import "./styles.css";

type Props = {
    className: string
}
type ProjectVolumeData = {
    project: string
    count: number
    developer: string
}

type ProjectObject = {
    project: string
    count: number
    developer: string
}

const ActiveProjectsWidget: React.FC<Props> = ({ className }) => {
    const dispatch = useAppDispatch()
    const countries = ['UAE']
    const cities = ['Dubai']
    const timelines = ['Year', 'Month']
    const initialFilter: FiltersType = {
        country: countries[0],
        city: cities[0],
        year: undefined,
        month: undefined,
        notifications: true,
    }
    const [filters, setFilters] = useState<FiltersType>(initialFilter)
    useEffect(() => {
        if (filters.year === undefined && filters.month === undefined) {
            dispatch(getMostActiveProjects())
        } else {
            dispatch(getFilterActiveProjects(filters))
        }
    }, [filters])

    const data = useAppSelector((state) => state.dashboard.activeProjects) as ProjectVolumeData[]
    // const mostActiveProjectsArray = useMemo(() => {
    //   if (data) {
    //     return data
    //   }
    //   return []
    // }, [data])

    const projectElements = data
        ? data.map((most_active_project: ProjectObject, index: number) => {
            let random = Math.floor(6 * Math.random())
            if (random === 0) random = 1

            let imagePath = `/media/projects-images/projects-images (${random}).png`

            return (
                <div className='d-flex mb-7' key={index}>
                    <div className='symbol symbol-50px me-5'>
                        <span className='symbol-label'>
                            <img src={toAbsoluteUrl(imagePath)} className='h-50 align-self-center' alt='' />
                        </span>
                    </div>

                    <div className='d-flex align-items-center flex-wrap flex-grow-1 mt-n2 mt-lg-n1'>
                        <div className='d-flex flex-column flex-grow-1 my-lg-0 my-2 pe-3'>
                            <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bolder'>
                                {most_active_project.project}
                            </a>
                            <span className='text-gray-400 fw-bold fs-7 my-1'></span>
                            <span className='text-gray-400 fw-bold fs-7'>
                                By:{' '}
                                <p className='text-primary fw-bold project_developer'>
                                    {most_active_project.developer ? most_active_project.developer : ''}
                                </p>
                            </span>
                        </div>

                        <div className='text-end py-lg-0 py-2'>
                            <span className='text-gray-800 fw-boldest fs-3'>{most_active_project.count}</span>
                            <span className='text-gray-400 fs-7 fw-bold d-block'>Sales</span>
                        </div>
                    </div>
                </div>
            )
        })
        : undefined

    return (
        <div className={clsx('card', className)}>
            {/* begin::Header */}
            <div className='card-header align-items-center border-0 mt-3'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='fw-bolder text-dark fs-3'>Most Active Projects</span>
                    <span className='text-gray-400 mt-2 fw-bold fs-6'>
                        Trending projects for the past month
                    </span>
                </h3>
                <div className='card-toolbar'>
                    {/* begin::Menu */}
                    <button
                        type='button'
                        className='btn btn-clean btn-sm btn-icon btn-icon-primary btn-active-light-primary me-n3'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                    >
                        <KTIcon iconName='category' className='fs-2' />
                    </button>
                    {/* <Dropdown1 /> */}
                    <FilterOptions
                        countries={countries}
                        cities={cities}
                        years={yearsData}
                        months={monthsData}
                        filters={filters}
                        setFilters={setFilters}
                        type={"sales"}
                    />
                    {/* end::Menu */}
                </div>
            </div>
            {/* end::Header */}
            {/* begin::Body */}
            <div className='card-body pt-5 mostActiveProjectsBodyStyles'>{projectElements}</div>
            {/* end::Body */}
        </div>
    )
}

export { ActiveProjectsWidget }
