import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import jwtDefaultConfig from './jwtDefaultConfig'
import { getAuth, removeAuth, setAuth } from '../modules/auth'
import { ChatQueryType } from 'app/redux/features/chatbot-slice'
import { TimeFrameTypes } from 'app/modules/dashboard/components/SupplyDemandWidget'
import { FiltersType } from 'app/modules/dashboard/components/MixedWidgetSales'
import { ApiEndpoints } from './ApiEndpoints'
import Cookies from 'js-cookie'

import { auth } from "../../firebase"
export default class JwtService {
  getAccessToken() {
    throw new Error('Method not implemented.')
  }

  async getCurrentUser() {
    if (auth.currentUser) {
      let refresh_token = auth.currentUser.refreshToken
      let new_token = await auth.currentUser.getIdToken(true)
      Cookies.set("gid_token", refresh_token)
      this.setTokens(new_token, refresh_token)
    }
  }

  jwtConfig: ApiEndpoints = { ...jwtDefaultConfig }
  constructor(jwtOverrideConfig: any) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    axios.interceptors.request.use(
      (config: any) => {
        
        /*
          Removed access token from header
          const accessToken = this.getToken()
          const accessToken = Cookies.get('gid_token')
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
          }
        */

        config.headers.credentials = 'include'
        return config
      },
      (error) => Promise.reject(error)
    )

    axios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error) {
          // this.logout()
          // alert("ERROR ")
          this.getCurrentUser()
          // user.getIdToken().then((idToken: any) => {
          //   Cookies.set('gid_token', idToken)
          //   alert("Access Token Refreshed New Token: " + idToken)
          //   // console.log('Access token is refreshed');
          //   requestUser()
          // })
        }
        return Promise.reject(error)
      }
    )
  }
  logout() {
    this.removeTokens()
  }

  getToken(): any {
    //this.jwtConfig.storageTokenKeyName = 'accessToken'
    const auth = getAuth()
    return auth?.token
  }

  getRefreshToken(): any {
    const auth = getAuth()
    return auth?.refreshToken
    // return localStorage.getItem('refreshToken')
  }
  setTokens(token: string, refreshToken: string) {
    setAuth({
      token: token,
      refreshToken: refreshToken,
    })
  }
  removeTokens() {
    removeAuth()
  }
  //get user by id
  getUserById(id: string) {
    return axios.get(`${this.jwtConfig.user}/${id}`)
  }

  updateUser(id: string, data: any) {
    return axios.patch(`${this.jwtConfig.user}/${id}`, data)
  }
  //get logged in user profile details
  getUserDetails() {
    const data: any = jwtDecode(this.getToken())
    const { sub } = data || {}
    return axios.get(`${this.jwtConfig.userDetail}/${sub}`)
  }

  //update user profile
  updateUserProfile(data: any) {
    const tokenDetail: any = jwtDecode(this.getToken())
    const { sub } = tokenDetail || {}
    return axios.patch(`${this.jwtConfig.user}/${sub}`, data)
  }

  // Get all profiles
  getAllProfile() {
    const tokenDetail: any = jwtDecode(this.getToken())
    const { sub } = tokenDetail || {}
    return axios.get(`${this.jwtConfig.userDetail}/${sub}`)
  }

  /********************************** DASHBOARD START **********************************/
  /********************************** DASHBOARD START **********************************/
  // @1 /* RENTALS DASHBOARD START */
  // 1.1
  getAverageRentAmount() {
    return axios.get(`${this.jwtConfig.dashboardRent}/average-rent-price`)
  }
  // 1.2
  getMostPopularRentalArea() {
    return axios.get(`${this.jwtConfig.dashboardRent}/most-rented-area`)
  }
  // 1.3
  getMostRentedPropertyType() {
    return axios.get(`${this.jwtConfig.dashboardRent}/most-rented-property-type`)
  }
  // 1.4
  getAverageRentGraph(year?: number, month?: number) {
    // Calculate the average rent price for the past 7 months or for a specific month and year.
    let params: { year?: number; month?: number } = {}

    if (year !== undefined) {
      params.year = year
    }
    if (month !== undefined) {
      params.month = month
    }

    return axios.get(`${this.jwtConfig.dashboardRent}/average-rent-graph`, { params })
  }

  // @1 /* RENTALS DASHBOARD END */

  // @2 /* SALES DASHBOARD START */
  // 2.1
  getAverageSalesPrice() {
    return axios.get(`${this.jwtConfig.dashboardSales}/average-sales-price`)
  }
  // 2.2
  getAverageSalesGraph(year?: number, month?: number) {
    let params: { year?: number; month?: number } = {}

    if (year !== undefined) {
      params.year = year
    }
    if (month !== undefined) {
      params.month = month
    }

    return axios.get(`${this.jwtConfig.dashboardSales}/average-sales-graph`, { params })
  }
  // 2.3
  getMostBoughtArea() {
    return axios.get(`${this.jwtConfig.dashboardSales}/most-bought-area`)
  }
  // 2.4
  getMostBoughtProject() {
    return axios.get(`${this.jwtConfig.dashboardSales}/most-bought-project`)
  }
  // 2.5
  getMostBoughtPropertyType() {
    return axios.get(`${this.jwtConfig.dashboardSales}/most-bought-property-type`)
  }
  // @2 /* SALES DASHBOARD END */

  // @3 /* SUPPLIES DASHBOARD START */
  // 3.1
  getDemandRate() {
    return axios.get(`${this.jwtConfig.dashboardSupplyDemand}/demand-rate`)
  }
  // 3.2
  getMostActiveProjects(year?: number, month?: number) {
    let params: { year?: number; month?: number } = {}

    if (year !== undefined) {
      params.year = year
    }

    if (month !== undefined) {
      params.month = month
    }

    return axios.get(`${this.jwtConfig.dashboardSupplyDemand}/most-active-projects`, { params })
  }
  // 3.3
  getSupplyRate() {
    return axios.get(`${this.jwtConfig.dashboardSupplyDemand}/supply-rate`)
  }
  // 3.4
  getTrendingAreas(year?: number, month?: number) {
    let params: { year?: number; month?: number } = {}
    if (year !== undefined) {
      params.year = year
    }
    if (month !== undefined) {
      params.month = month
    }
    return axios.get(`${this.jwtConfig.dashboardSupplyDemand}/trending-areas`, { params })
  }
  // 3.5
  getTrendingProjects() {
    return axios.get(`${this.jwtConfig.dashboardSupplyDemand}/trending-projects`)
  }
  // @3 /* SUPPLIES DASHBOARD END */

  /********************************** DASHBOARD END **********************************/
  /********************************** DASHBOARD END **********************************/

  /** Conversation START **/
  /** Conversation START **/

  postConversation(prompt: string) {
    return axios.post(`${this.jwtConfig.conversation}/create`, { prompt })
  }

  getAllConversations() {
    return axios.get(`${this.jwtConfig.conversation}/me`)
  }

  getConversationById(id: string) {
    return axios.get(`${this.jwtConfig.conversation}/${id}`)
  }

  continueConversation(id: string, prompt: string) {
    return axios.post(`${this.jwtConfig.conversation}/continue/${id}`, { prompt })
  }

  deleteConversationById(id: string) {
    return axios.delete(`${this.jwtConfig.conversation}/${id}`)
  }

  updateFeedbackById(message_id: string, feedbackData: object) {
    if(message_id != 'undefined') {
      return axios.put(`${this.jwtConfig.conversation}/feedback/${message_id}`, {feedbackData})
    }
  }

  /** Conversation END **/
  /** Conversation END **/
}
