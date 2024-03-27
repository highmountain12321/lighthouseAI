/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { FiltersType } from './MixedWidgetSales'
import { useAppDispatch } from 'app/redux/hooks'
import { getMostTrendingAreas } from 'app/redux/thunks/dashboardThunk'

export function CustomDropdown() {
  const dispatch = useAppDispatch()
  const countries = ['UAE',]
  const cities = ['Dubai',]
  const [filters, setFilters] = useState<FiltersType>()
  useEffect(() => {
    dispatch(getMostTrendingAreas(filters))
  }, [filters])
  const [month, setMonth] = useState<number | undefined>()
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  return (
    <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
      <div className='px-7 py-5'>
        <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
      </div>

      <div className='separator border-gray-200'></div>

      <div className='px-7 py-5'>
        <div className='mb-10'>
          <label className='form-label fw-bold'>Country:</label>

          <div>
            <select
              className='form-select form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={'UAE'}
            >
              <option disabled></option>
              <option value='UAE'>UAE</option>
            </select>
          </div>
        </div>
        <div className='mb-10'>
          <label className='form-label fw-bold'>City:</label>

          <div>
            <select
              className='form-select form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={'Dubai'}
            >
              <option disabled></option>
              <option value='Dubai'>Dubai</option>
            </select>
          </div>
        </div>
        <div className='mb-10'>
          <label className='form-label fw-bold'>Months:</label>

          <div className='d-flex'>
            {months.map(item => (
              <label key={item} className='form-check form-check-sm form-check-custom form-check-solid me-5'>
                <input className='form-check-input' type='checkbox' name='month' value={item} checked={month === item} onChange={e => {
                  if (e.target.checked) {
                    setMonth(item as number)
                  } else {
                    setMonth(undefined)
                  }
                }} />
                <span className='form-check-label'>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='mb-10'>
          <label className='form-label fw-bold'>Notifications:</label>

          <div className='form-check form-switch form-switch-sm form-check-custom form-check-solid'>
            <input
              className='form-check-input'
              type='checkbox'
              value=''
              name='notifications'
              defaultChecked={true}
            />
            <label className='form-check-label'>Enabled</label>
          </div>
        </div>

        <div className='d-flex justify-content-end'>
          <button
            type='button'
            className='btn btn-sm btn-light btn-active-light-primary me-2'
            // data-kt-menu-dismiss='true'
            onClick={e => {
              setMonth(undefined)
              setFilters({
                country: 'UAE',
                city: 'Dubai',
                month: undefined,
                notifications: true,
              })
            }}
          >
            Reset
          </button>

          <button
            type='button'
            className='btn btn-sm btn-primary'
            data-kt-menu-dismiss='true'
            onClick={e => {
              e.preventDefault()
              setFilters({
                country: 'UAE',
                city: 'Dubai',
                // area: area,
                month: month,
                notifications: true
              })
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
