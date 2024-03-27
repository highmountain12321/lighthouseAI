import JwtService from '../../axios/usejwt'
import {createAsyncThunk} from '@reduxjs/toolkit'

const {jwt} = JwtService({})

export const fetchUserById = createAsyncThunk('fetch-user', async (extra: any, any) => {
  try {
    const response = await jwt.getUserById(extra.id)
    return response.data
  } catch (error: any) {
    const {data} = error.response
    // alert(data.message)
  }
})

export const updateUser = createAsyncThunk('update-user', async (extra: any, any) => {
  try {
    const response = await jwt.updateUser(extra.id, extra.data)
    return response.data
  } catch (error: any) {
    const {data} = error.response
    // alert(data.message)
  }
})
