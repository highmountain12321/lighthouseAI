// profile-slice.js
import { createSlice } from '@reduxjs/toolkit'
import { profileDetailAsync, updateProfile } from '../thunks/profileThunk'

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    loading: false,
    crudSuccess: false,
    crudError: null,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(profileDetailAsync.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(profileDetailAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(profileDetailAsync.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateProfile.pending, state => {
        state.loading = true
        state.crudSuccess = false
      })
      .addCase(updateProfile.fulfilled, (state, action: any) => {
        state.loading = false
        state.crudSuccess = !state.crudSuccess
        state.crudError = null
      })
      .addCase(updateProfile.rejected, (state: any, action) => {
        state.loading = false
        state.crudError = action.error.message
      })
  }
})

export default profileSlice.reducer
