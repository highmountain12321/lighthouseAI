import JwtService from '../../axios/usejwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

const { jwt } = JwtService({})
export const profileDetailAsync = createAsyncThunk('user', async () => {
  try {
    const response = await jwt.getUserDetails()
    return response.data
  } catch (error: any) {
    const { data } = error.response
    // alert(data.message)
  }
})

export const updateProfile = createAsyncThunk(
  'user/update',
  async (extra: any, any) => {
    try {
      const response = await jwt.updateUserProfile(extra.profileData)
      extra.reset()
      // console.log('Profile update successfully')
      return response.data
    } catch (error: any) {
      const { data } = error.response
      // alert(data.message)
    }
  }
)

export const getAllProfile = createAsyncThunk(
'user.getAllProfile',
async(extra: any, any) => {
try {
const response = await jwt.getAllProfile()
extra.reset()
return response.data;
} catch(err:any){
const {data} = err.response
// alert(data.message)
}
  }
)
