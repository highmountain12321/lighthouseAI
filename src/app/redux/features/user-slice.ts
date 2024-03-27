// userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { fetchUserById, updateUser } from '../thunks/userThunk'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUserById.rejected, (state: any, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state: any, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUser.rejected, (state:any, action) => {
        state.loading = true
        state.error = action.error.message
      })
  }
})

export default userSlice.reducer
