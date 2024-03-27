// dashboard-slice.js
import { createSlice } from '@reduxjs/toolkit'
import { getDemandRates, getFilterActiveProjects, getTrendingProjects, getMostActiveProjects, getMostTrendingAreas, getRentals, getSales, getSupplies, getSupplyRates, getAverageSales, getAverageRentals, getMostBoughtArea, getMostBoughtPropertyType, getMostBoughtProject, getFilterTrendingAreas } from '../thunks/dashboardThunk'
import { SupplyDemandData } from 'app/modules/dashboard/components/methods'
const profileSlice = createSlice({
  name: 'dashboard',
  initialState: {
    sales: null,
    rentals: null,
    supplyRates: {
      name: [],
      count: [],
      avg_value: [],
      max_value: []
    } as SupplyDemandData,
    demandRates: {
      name: [],
      count: [],
      avg_value: [],
      max_value: []
    } as SupplyDemandData,
    mostTrendingAreas: null,
    activeProjects: null as any | null,
    latestReleases: null,
    loading: false,
    error: null,
    averageSales: null,
    averageRentals: null,
    mostBoughtArea: null,
    mostBoughtProject: null,
    mostBoughtPropertyType: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRentals.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getRentals.fulfilled, (state, action) => {
        state.loading = false
        state.rentals = action.payload
      })
      .addCase(getRentals.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getSales.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getSales.fulfilled, (state, action: any) => {
        state.loading = false
        state.sales = action.payload
      })
      .addCase(getSales.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getSupplyRates.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getSupplyRates.fulfilled, (state, action: any) => {
        state.loading = false
        state.supplyRates = action.payload
        state.error = null
      })
      .addCase(getSupplyRates.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getDemandRates.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getDemandRates.fulfilled, (state, action: any) => {
        state.loading = false
        state.demandRates = action.payload
        state.error = null
      })
      .addCase(getDemandRates.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getMostTrendingAreas.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getMostTrendingAreas.fulfilled, (state, action: any) => {
        state.loading = false
        state.mostTrendingAreas = action.payload
        state.error = null
      })
      .addCase(getMostTrendingAreas.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getFilterTrendingAreas.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getFilterTrendingAreas.fulfilled, (state, action: any) => {
        state.loading = false
        state.mostTrendingAreas = action.payload
        state.error = null
      })
      .addCase(getFilterTrendingAreas.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getMostActiveProjects.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getMostActiveProjects.fulfilled, (state, action: any) => {
        state.loading = false
        state.activeProjects = action.payload
        state.error = null
      })
      .addCase(getMostActiveProjects.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getFilterActiveProjects.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getFilterActiveProjects.fulfilled, (state, action: any) => {
        state.loading = false
        state.activeProjects = action.payload
        state.error = null
      })
      .addCase(getFilterActiveProjects.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getTrendingProjects.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getTrendingProjects.fulfilled, (state, action: any) => {
        state.loading = false
        state.latestReleases = action.payload
        state.error = null
      })
      .addCase(getTrendingProjects.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getAverageSales.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getAverageSales.fulfilled, (state, action: any) => {
        state.loading = false
        state.averageSales = action.payload
        state.error = null
      })
      .addCase(getAverageSales.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getAverageRentals.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getAverageRentals.fulfilled, (state, action: any) => {
        state.loading = false
        state.averageRentals = action.payload
        state.error = null
      })
      .addCase(getAverageRentals.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // get Most Bought Area
      .addCase(getMostBoughtArea.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getMostBoughtArea.fulfilled, (state, action: any) => {
        state.loading = false
        state.mostBoughtArea = action.payload
        state.error = null
      }
      )
      .addCase(getMostBoughtArea.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Most Bought Project
      .addCase(getMostBoughtProject.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getMostBoughtProject.fulfilled, (state, action: any) => {
        state.loading = false
        state.mostBoughtProject = action.payload
        state.error = null
      })
      .addCase(getMostBoughtProject.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Most Bought Property Type
      .addCase(getMostBoughtPropertyType.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getMostBoughtPropertyType.fulfilled, (state, action: any) => {
        state.loading = false
        state.mostBoughtPropertyType = action.payload
        state.error = null
      })
      .addCase(getMostBoughtPropertyType.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})
export default profileSlice.reducer

