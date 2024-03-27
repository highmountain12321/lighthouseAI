import {FiltersType} from 'app/modules/dashboard/components/MixedWidgetSales'
import JwtService from '../../axios/usejwt'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {TimeFrameTypes} from 'app/modules/dashboard/components/SupplyDemandWidget'
const {jwt} = JwtService({})
export const getSales = createAsyncThunk('dashboard/sales', async (extra?: FiltersType) => {
  try {
    if (extra) {
      const response = await jwt.getAverageSalesGraph(extra.year, extra.month)
      return response.data
    } else {
      const response = await jwt.getAverageSalesGraph()
      return response.data
    }
  } catch (error: any) {
    const {data} = error.response
    // alert(data.message)
  }
})
export const getRentals = createAsyncThunk('dashboard/rentals', async (extra?: FiltersType) => {
  try {
    if (extra) {
      const response = await jwt.getAverageRentGraph(extra.year, extra.month)
      return response.data
    } else {
      const response = await jwt.getAverageRentGraph()
      return response.data
    }
  } catch (error: any) {
    const {data} = error.response
    // alert(data.message)
  }
})
export const getAverageSales = createAsyncThunk('dashboard/averageSalesPrice', async () => {
  try {
    const response = await jwt.getAverageSalesPrice()
    return response.data
  } catch (error: any) {
    const {data} = error.response
    // alert(data.message)
  }
})
export const getAverageRentals = createAsyncThunk('dashboard/averageRentalsPrice', async () => {
  try {
    const response = await jwt.getAverageRentAmount()
    return response.data
  } catch (error: any) {
    const {data} = error.response
    // alert(data.message)
  }
})
export const getSupplies = createAsyncThunk('dashboard/supplies', async () => {
  try {
    const response = await jwt.getSupplyRate()
    return response.data
  } catch (err: any) {
    const {data} = err.response
    // alert(data.message)
  }
})
export const getSupplyRates = createAsyncThunk('dashboard/supply-rate', async () => {
  try {
    const response = await jwt.getSupplyRate()
    return response.data
  } catch (err: any) {
    const {data} = err.response
    // alert(data.message)
  }
})
export const getDemandRates = createAsyncThunk('dashboard/demand-rate', async () => {
  try {
    const response = await jwt.getDemandRate()
    return response.data
  } catch (err: any) {
    const {data} = err.response
    // alert(data.message)
  }
})
export const getMostTrendingAreas = createAsyncThunk(
  'dashboard/most-trending-areas',
  async (extra?: FiltersType) => {
    try {
      const response = await jwt.getTrendingAreas()
      return response.data
    } catch (err: any) {
      const {data} = err.response
      // alert(data.message)
    }
  }
)
export const getFilterTrendingAreas = createAsyncThunk(
  'dashboard/filter-trending-areas',
  async (extra: FiltersType) => {
    try {
      const response = await jwt.getTrendingAreas(extra.year, extra.month)     
      return response.data
    } catch (err: any) {
      const {data} = err.response
      // alert(data.message)
    }
  }
)
export const getMostActiveProjects = createAsyncThunk(
  'dashboard/most-active-projects',
  async () => {
    try {
      const response = await jwt.getMostActiveProjects()
      return response.data
    } catch (err: any) {
      const {data} = err.response
      // alert(data.message)
    }
  }
)
export const getFilterActiveProjects = createAsyncThunk(
  'dashboard/filter-active-projects',
  async (extra: FiltersType) => {
    try {
      const response = await jwt.getMostActiveProjects(extra.year, extra.month)
      return response.data
    } catch (err: any) {
      const {data} = err.response
      // alert(data.message)
    }
  }
)
export const getTrendingProjects = createAsyncThunk('dashboard/latest-releases', async () => {
  try {
    const response = await jwt.getTrendingProjects()
    return response.data
  } catch (err: any) {
    const {data} = err.response
    // alert(data.message)
  }
})
// New thunks
export const getMostBoughtArea = createAsyncThunk('dashboard/most-bought-area', async () => {
  try {
    const response = await jwt.getMostBoughtArea()
    return response.data
  } catch (err: any) {
    const {data} = err.response
    // alert(data.message)
  }
})
export const getMostBoughtProject = createAsyncThunk('dashboard/most-bought-project', async () => {
  try {
    const response = await jwt.getMostBoughtProject()
    return response.data
  } catch (err: any) {
    const {data} = err.response
    // alert(data.message)
  }
})
export const getMostBoughtPropertyType = createAsyncThunk(
  'dashboard/most-bought-property-type',
  async () => {
    try {
      const response = await jwt.getMostBoughtPropertyType()
      return response.data
    } catch (err: any) {
      const {data} = err.response
      // alert(data.message)
    }
  }
)