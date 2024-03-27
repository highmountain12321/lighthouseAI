/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { Dropdown1 } from '_metronic/partials'
import { KTIcon } from '_metronic/helpers'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import { getDemandRates, getSupplyRates } from 'app/redux/thunks/dashboardThunk'
import { SupplyDemandData, SupplyDemandDataArrayOfObjects, convert2ArraysToObjectArray, convertLargerNumberToMillionOrTrillionOrWhatsBest, convertSupplyDemandDataToArrayOfObjects } from '../components/methods'
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper'
import { FilterOptions } from '../components/FilterOptions'
import { FiltersType } from '../components/MixedWidgetSales'

type Props = {
    className: string
    color: string
    type: "Supply" | "Demand"
}

const SupplyDemandCard: React.FC<Props> = ({ className, color, type }) => {
    const dispatch = useAppDispatch()

    let seriesData: SupplyDemandDataArrayOfObjects[] = []

    // 1) Sum of count = no.of projects sold
    // 2) Total value of transactions = Sum(max_value) AED
    // 3) Average Value = Total value = Sum of total value / sum of count = Average Property Value
    // 4) Most Projects Sold = 61 = Al Barsha South Fourth

    // Supply Summary
    // 1) No. of projects sold
    let NumberOfProjectsSoldSupply: number = 0
    // 2) Total value of transactions
    let TotalValueOfTransactionsSupply: number = 0
    // 3) Average Property Value
    let AveragePropertyValueSupply: number = 0
    // 4) Most Projects Sold
    let MostProjectsSoldSupply: SupplyDemandDataArrayOfObjects = {} as SupplyDemandDataArrayOfObjects

    // Demand Summary
    // 1) No. of projects sold
    let NumberOfProjectsSoldDemand: number = 0
    // 2) Total value of transactions
    let TotalValueOfTransactionsDemand: number = 0
    // 3) Average Property Value
    let AveragePropertyValueDemand: number = 0
    // 4) Most Projects Sold
    let MostProjectsSoldDemand: SupplyDemandDataArrayOfObjects = {} as SupplyDemandDataArrayOfObjects

    // Supply Rate and Demand Rate
    let SupplyRate = 0.0
    let DemandRate = 0.0

    const supplyRates: SupplyDemandData = useAppSelector(state => state.dashboard.supplyRates) as SupplyDemandData
    const demandRates: SupplyDemandData = useAppSelector(state => state.dashboard.demandRates) as SupplyDemandData

    // console.log("Supply rates ==> ", supplyRates)
    // console.log("Demand rates ==> ", demandRates)

    const array_of_obj_supply_rates = (supplyRates !== undefined) ? convertSupplyDemandDataToArrayOfObjects(supplyRates) as SupplyDemandDataArrayOfObjects[] : []
    const array_of_obj_demand_rates = (demandRates !== undefined) ? convertSupplyDemandDataToArrayOfObjects(demandRates) as SupplyDemandDataArrayOfObjects[] : []

    NumberOfProjectsSoldSupply = array_of_obj_supply_rates.reduce((acc, curr) => acc + curr.count, 0)
    NumberOfProjectsSoldDemand = array_of_obj_demand_rates.reduce((acc, curr) => acc + curr.count, 0)

    if (type === "Supply") {
        TotalValueOfTransactionsSupply = array_of_obj_supply_rates.reduce((acc, curr) => acc + curr.max_value, 0)
        AveragePropertyValueSupply = TotalValueOfTransactionsSupply / NumberOfProjectsSoldSupply
        // So most projects sold is the one with the highest count value then find name of that project
        const max_count = Math.max(...array_of_obj_supply_rates.map(obj => obj.count))
        const obj = array_of_obj_supply_rates.find(obj => obj.count === max_count)
        MostProjectsSoldSupply = obj as SupplyDemandDataArrayOfObjects

        seriesData = array_of_obj_supply_rates

    } else if (type === "Demand") {
        TotalValueOfTransactionsDemand = array_of_obj_demand_rates.reduce((acc, curr) => acc + curr.max_value, 0)
        AveragePropertyValueDemand = TotalValueOfTransactionsDemand / NumberOfProjectsSoldDemand
        // So most projects sold is the one with the highest count value then find name of that project
        const max_count = Math.max(...array_of_obj_demand_rates.map(obj => obj.count))
        const obj = array_of_obj_demand_rates.find(obj => obj.count === max_count)
        MostProjectsSoldDemand = obj as SupplyDemandDataArrayOfObjects

        seriesData = array_of_obj_demand_rates

        DemandRate = NumberOfProjectsSoldDemand
        // Supply Rate and Demand Rate
    }

    SupplyRate = parseFloat((NumberOfProjectsSoldSupply / NumberOfProjectsSoldDemand).toFixed(3))

    useEffect(() => {
        const fetchData = async () => {
            if (type === "Supply") {
                await dispatch(getSupplyRates())
            } else if (type === "Demand") {
                await dispatch(getDemandRates())
            }
        }
        fetchData()
    }, [type])

    useEffect(() => {
        if (type === "Supply") {
            // console.log("Supply rates ==> ", seriesData)
        } else if (type === "Demand") {
            // console.log("Demand rates ==> ", seriesData)
        }
    }, [seriesData])

    return (
        <div className={`card ${className}`}>
            {/* begin::Body */}
            <div className='card-body p-0'>
                {/* begin::Header */}
                <div className={`px-9 pt-7 card-rounded h-275px w-100 bg-${color}`}>
                    {/* begin::Heading */}
                    <div className='d-flex flex-stack'>
                        <h3 className='m-0 text-white fw-bold fs-3'>{type} Summary</h3>
                        <div className='ms-1'>
                            {/* begin::Menu */}
                            <RoleLockWrapper locked={true}>
                            <button
                                type='button'
                                className={`btn btn-sm btn-icon btn-color-white btn-active-white btn-active-color-${color} border-0 me-n3`}
                                data-kt-menu-trigger='click'
                                data-kt-menu-placement='bottom-end'
                                data-kt-menu-flip='top-end'
                            >
                                <KTIcon iconName='category' className='fs-2' />
                            </button>
                            </RoleLockWrapper>
                            <Dropdown1 />
                            {/* end::Menu */}
                        </div>
                    </div>
                    {/* end::Heading */}
                    {/* begin::Balance */}
                    <div className='d-flex text-center flex-column text-white pt-8'>
                        <span className='fw-semibold fs-7'>{type} Rate</span>
                        <span className='fw-bold fs-2x pt-1'>
                            {
                                type === "Supply" ? (
                                    SupplyRate
                                ) : (
                                    DemandRate
                                )
                            } %
                        </span>
                    </div>
                    {/* end::Balance */}
                </div>
                {/* end::Header */}
                {/* begin::Items */}
                <div
                    className='shadow-xs card-rounded mx-9 mb-9 px-6 py-9 position-relative z-index-1 bg-body'
                    style={{ marginTop: '-100px' }}
                >
                    {/* begin::Item */}
                    <div className='d-flex align-items-center mb-6'>
                        {/* begin::Symbol */}
                        <div className='symbol symbol-45px w-40px me-5'>
                            <span className='symbol-label bg-lighten'>
                                <KTIcon iconName='compass' className='fs-1' />
                            </span>
                        </div>
                        {/* end::Symbol */}
                        {/* begin::Description */}
                        <div className='d-flex align-items-center flex-wrap w-100'>
                            {/* begin::Title */}
                            <div className='mb-1 pe-3 flex-grow-1'>
                                <a href='#' className='fs-5 text-gray-600 text-hover-primary fw-bold'>
                                    Projects sold
                                </a>
                                <div className='text-gray-400 fw-semibold fs-7 hidden'>100 Regions</div>
                            </div>
                            {/* end::Title */}
                            {/* begin::Label */}
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold fs-5 text-gray-800 pe-1'>
                                    {/* $2,5b */}
                                    {type === "Supply" ? NumberOfProjectsSoldSupply : NumberOfProjectsSoldDemand}
                                </div>
                                <KTIcon iconName='arrow-up' className='fs-5 text-success ms-1' />
                            </div>
                            {/* end::Label */}
                        </div>
                        {/* end::Description */}
                    </div>
                    {/* end::Item */}
                    {/* begin::Item */}
                    <div className='d-flex align-items-center mb-6'>
                        {/* begin::Symbol */}
                        <div className='symbol symbol-45px w-40px me-5'>
                            <span className='symbol-label bg-lighten'>
                                <KTIcon iconName='category' className='fs-1' />
                            </span>
                        </div>
                        {/* end::Symbol */}
                        {/* begin::Description */}
                        <div className='d-flex align-items-center flex-wrap w-100'>
                            {/* begin::Title */}
                            <div className='mb-1 pe-3 flex-grow-1'>
                                <a href='#' className='fs-5 text-gray-600 text-hover-primary fw-bold'>
                                    Total transactions
                                </a>
                                <div className='text-gray-400 fw-semibold fs-7 hidden'>Quarter 2/3</div>
                            </div>
                            {/* end::Title */}
                            {/* begin::Label */}
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold fs-5 text-gray-800 pe-1'>
                                    {/* $1,7b */}
                                    AED {convertLargerNumberToMillionOrTrillionOrWhatsBest(type === "Supply" ? TotalValueOfTransactionsSupply : TotalValueOfTransactionsDemand)}
                                </div>
                                <KTIcon iconName='arrow-down' className='fs-5 text-danger ms-1' />
                            </div>
                            {/* end::Label */}
                        </div>
                        {/* end::Description */}
                    </div>
                    {/* end::Item */}
                    {/* begin::Item */}
                    <div className='d-flex align-items-center mb-6'>
                        {/* begin::Symbol */}
                        <div className='symbol symbol-45px w-40px me-5'>
                            <span className='symbol-label bg-lighten'>
                                <KTIcon iconName='phone' className='fs-1' />
                            </span>
                        </div>
                        {/* end::Symbol */}
                        {/* begin::Description */}
                        <div className='d-flex align-items-center flex-wrap w-100'>
                            {/* begin::Title */}
                            <div className='mb-1 pe-3 flex-grow-1'>
                                <a href='#' className='fs-5 text-gray-600 text-hover-primary fw-bold'>
                                    Average Value
                                </a>
                                <div className='text-gray-400 fw-semibold fs-7 hidden'>80% Rate</div>
                            </div>
                            {/* end::Title */}
                            {/* begin::Label */}
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold fs-5 text-gray-800 pe-1'>
                                    {/* $8,8m */}
                                    AED {convertLargerNumberToMillionOrTrillionOrWhatsBest(type === "Supply" ? AveragePropertyValueSupply : AveragePropertyValueDemand)}
                                </div>
                                <KTIcon iconName='arrow-up' className='fs-5 text-success ms-1' />
                            </div>
                            {/* end::Label */}
                        </div>
                        {/* end::Description */}
                    </div>
                    {/* end::Item */}
                    {/* begin::Item */}
                    <div className='d-flex align-items-center'>
                        {/* begin::Symbol */}
                        <div className='symbol symbol-45px w-40px me-5'>
                            <span className='symbol-label bg-lighten'>
                                <KTIcon iconName='document' className='fs-1' />
                            </span>
                        </div>
                        {/* end::Symbol */}
                        {/* begin::Description */}
                        <div className='d-flex align-items-center flex-wrap w-100'>
                            {/* begin::Title */}
                            <div className='mb-1 pe-3 flex-grow-1'>
                                <a href='#' className='fs-5 text-gray-600 text-hover-primary fw-bold'>
                                    Most Projects Sold
                                </a>
                                <div className='text-gray-400 fw-semibold fs-7'>
                                    {/* 3090 Refunds */}
                                    {(type === "Supply") ? (
                                        <>
                                            {(MostProjectsSoldSupply !== undefined) && (MostProjectsSoldSupply?.name)}
                                        </>
                                    ) : (
                                        <>
                                            {(MostProjectsSoldDemand !== undefined) && (MostProjectsSoldDemand?.name)}
                                        </>
                                    )}

                                </div>
                            </div>
                            {/* end::Title */}
                            {/* begin::Label */}
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold fs-5 text-gray-800 pe-1'>
                                    {/* $270m */}
                                    {(type === "Supply") ? (
                                        <>
                                            {
                                                (MostProjectsSoldSupply !== undefined) && (MostProjectsSoldSupply?.count)
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {
                                                (MostProjectsSoldDemand !== undefined) && (MostProjectsSoldDemand?.count)
                                            }
                                        </>
                                    )}
                                </div>
                                <KTIcon iconName='arrow-down' className='fs-5 text-danger ms-1' />
                            </div>
                            {/* end::Label */}
                        </div>
                        {/* end::Description */}
                    </div>
                    {/* end::Item */}
                </div>
                {/* end::Items */}
            </div>
            {/* end::Body */}
        </div>
    )
}

export default SupplyDemandCard;
