/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { FiltersType } from './MixedWidgetSales';
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper';
import { getRentals, getSales } from 'app/redux/thunks/dashboardThunk';
import { useAppDispatch } from 'app/redux/hooks';
import { monthsData } from './filters';

interface IFilterOptionsProps {
  countries: string[];
  cities: string[];
  years: number[];
  months: number[];
  filters: FiltersType;
  type: 'sales' | 'rentals';
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  showYears?: boolean;
}
export const FilterOptions: React.FC<IFilterOptionsProps> = ({ countries, cities, years, months, filters, setFilters, showYears = true, type }) => {
  const dispatch = useAppDispatch()

  const [country, setCountry] = useState(filters.country)
  const [city, setCity] = useState(filters.city)
  const [year, setYear] = useState<number | undefined>(filters.year)
  const [month, setMonth] = useState<number | undefined>(filters.month)
  const [notifications, setNotifications] = useState(filters.notifications)

  useEffect(() => {
    if (type === 'sales' && year !== undefined && month !== undefined && country && city) {
      dispatch(
        getSales({
          year: year as number,
          month: month as number,
          country: country,
          city: city,
          notifications: notifications
        })
      )
    } else {
      dispatch(
        getRentals({
          year: year as number,
          month: month as number,
          country: country,
          city: city,
          notifications: notifications
        })
      )
    }
  }, [year, month, country, city, notifications, type, dispatch])

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
              onChange={e => { setCountry(e.target.value) }}
              value={country}
            >
              <option disabled></option>
              {countries.map(item => <option key={item} value={item}>{item}</option>)}
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
              onChange={e => { setCity(e.target.value) }}
              value={city}
            >
              <option disabled></option>
              {cities.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        {showYears ? <div className='mb-10'>
          <label className='form-label fw-bold'>Years:</label>

          <div>
            <select
              className='form-select form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              onChange={e => { setYear(parseInt(e.target.value)) }}
              value={year}
            >
              <option value={undefined}></option>
              {years.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div> : undefined}
        <div className='mb-10'>
          <label className='form-label fw-bold'>Months:</label>

          <div>
            <select
              className='form-select form-select-solid'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              onChange={e => { setMonth(parseInt(e.target.value)) }}
              value={month}
            >
              <option value={undefined}></option>
              {monthsData.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          {/* <div
            className='d-flex'
            style={{
              flexWrap: 'wrap'
            }}
            data-kt-buttons='true'
          >
            {months.map(item => (
              <label key={item} className='form-check form-check-sm form-check-custom form-check-solid me-5 mt-4'>
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
          </div> */}
        </div>

        <div className='mb-10'>
          <label className='form-label fw-bold'>Notifications:</label>

          <RoleLockWrapper locked={true}>
            <div className='form-check form-switch form-switch-sm form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='checkbox'
                value=''
                name='notifications'
                onChange={e => { setNotifications(e.target.checked); }}
                checked={notifications}
              />
              {notifications ? <label className='form-check-label'>Enabled</label> : <label className='form-check-label'>Disabled</label>}
            </div>
          </RoleLockWrapper>
        </div>

        <div className='d-flex justify-content-end'>
          <button
            type='button'
            className='btn btn-sm btn-light btn-active-light-primary me-2'
            // data-kt-menu-dismiss='true'
            onClick={e => {
              e.preventDefault()
              setYear(undefined)
              setMonth(undefined)
              setFilters(prevFilters => {
                return {
                  country: prevFilters.country,
                  city: prevFilters.city,
                  year: undefined,
                  month: undefined,
                  notifications: prevFilters.notifications
                }
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
                country: country,
                city: city,
                year: year,
                month: month,
                notifications: notifications
              })
            }}
          >
            Apply
          </button>
        </div>
      </div >
    </div >
  )
}
