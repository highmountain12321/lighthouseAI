import React, { useEffect, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import { FiltersType } from '../MixedWidgetSales'
import { getFilterTrendingAreas, getMostTrendingAreas } from 'app/redux/thunks/dashboardThunk'
import { salesAreas } from '../cities'
import { FilterOptions } from '../FilterOptions'
import { monthsData, yearsData } from '../filters'
import "./styles.css"

type TrendingAreasWidgetProps = {
    className: string
    items?: number
}
type TrendingAreaData = {
    name: string[]
    pre_value: number[]
    cur_value: number[]
    percentage_change: number[]
}
type TrendingAreaObject = {
    name: string
    pre_value: number
    cur_value: number
    percentage_change: number
}
const convertDataToArrayOfObjects = (data: TrendingAreaData): TrendingAreaObject[] => {
    return data.name.map((name, index) => ({
        name: name,
        pre_value: data.pre_value[index],
        cur_value: data.cur_value[index],
        percentage_change: data.percentage_change[index],
    }))
}
const TrendingAreasWidget: React.FC<TrendingAreasWidgetProps> = ({ className, items = 6 }) => {
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
            dispatch(getMostTrendingAreas())
        } else {
            dispatch(getFilterTrendingAreas(filters))
        }
    }, [filters])

    const data = useAppSelector(
        (state) => state.dashboard.mostTrendingAreas
    ) as TrendingAreaData | null
    const arrayOfObjects = convertDataToArrayOfObjects(
        data || {
            name: [],
            pre_value: [],
            cur_value: [],
            percentage_change: [],
        }
    )
    /* calculate total change */
    const totalChange = arrayOfObjects.reduce(
        (acc, { percentage_change: change }) => acc + change,
        0
    )
    const projectElements = arrayOfObjects.map(
        ({ name: name, pre_value: pre_value, cur_value: cur_value, percentage_change: change }) => {
            /* calculate the percentage base on the totalChange */
            const changePercentage = (change / totalChange) * 100
            const random = Math.floor(6 * Math.random())
            const imagePath = `/media/areas-images/areas-images (${random}).png`
            return (
                <div className='d-flex align-items-sm-center mb-7' key={name}>
                    {/* begin::Symbol */}
                    <div className='symbol symbol-50px me-5'>
                        <span className='symbol-label'>
                            <img src={toAbsoluteUrl(imagePath)} className='h-50 align-self-center' alt='' />
                        </span>
                    </div>
                    {/* end::Symbol */}
                    {/* begin::Section */}
                    <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                        <div className='flex-grow-1 me-2'>
                            <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                {name}
                            </a>
                            <span className='text-muted fw-semibold d-block fs-7'></span>
                        </div>
                        <span className='badge badge-light fw-bold my-2'>{changePercentage.toFixed(2)}%</span>
                    </div>
                    {/* end::Section */}
                </div>
            )
        }
    )
    return (
        <div className='card card-xl-stretch mb-xl-8'>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold text-dark'>Trending Areas</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>Latest trending areas</span>
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
                    {/* <CustomDropdown /> */}
                    <FilterOptions
                        countries={countries}
                        cities={cities}
                        years={yearsData}
                        months={monthsData}
                        filters={filters}
                        setFilters={setFilters}
                        type={'sales'}
                    />
                    {/* end::Menu */}
                </div>
            </div>
            {/* end::Header */}
            {/* begin::Body */}
            <div className='card-body pt-5 trendingAreaWidgetBody'>{projectElements}</div>
            {/* end::Body */}
        </div>
    )
}
export { TrendingAreasWidget }
