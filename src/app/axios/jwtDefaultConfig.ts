import { ApiEndpoints } from './ApiEndpoints'

// #PRODUCTION
const MAIN_SERVICE_URL = 'https://dev.lighthouseuae.com/api/v1' // production url
const MAIN_DASHBOARD_API_URL = 'https://dev.lighthouseuae.com/api' // production url
const LIGHTHOUSEGPT_API_URL = 'https://dev.lighthouseuae.com/api/lighthousegpt' // production url

// #DEVELOPMENT
// const MAIN_SERVICE_URL = 'http://127.0.0.1:5000/api/v1' // development url
// const MAIN_DASHBOARD_API_URL = 'http://127.0.0.1:5000/api' // development url
// const LIGHTHOUSEGPT_API_URL = 'http://127.0.0.1:5000/api/lighthousegpt' // development url

// API Endpoints
const apiEndpoints: ApiEndpoints = {
  register: `${MAIN_SERVICE_URL}/user/signup`,
  login: `${MAIN_SERVICE_URL}/user/signin`,
  logout: `${MAIN_SERVICE_URL}/auth/logout`,
  sendOtp: `${MAIN_SERVICE_URL}/auth/send-otp`,
  verifyOtp: `${MAIN_SERVICE_URL}/auth/verify-otp`,
  refresh: `${MAIN_SERVICE_URL}/auth/refresh-tokens`,
  session: `${MAIN_DASHBOARD_API_URL}/auth/session`,
  userDetail: `${MAIN_SERVICE_URL}/users`,
  user: `${MAIN_SERVICE_URL}/user`,
  userProfiles: `${MAIN_SERVICE_URL}/user-profiles`,
  dashboardSupplyDemand: `${MAIN_DASHBOARD_API_URL}/dashboard/supply_demand`,
  dashboardSales: `${MAIN_DASHBOARD_API_URL}/dashboard/sales`,
  dashboardRent: `${MAIN_DASHBOARD_API_URL}/dashboard/rent`,
  conversation: `${MAIN_DASHBOARD_API_URL}/conversations`,
  claims: `${MAIN_DASHBOARD_API_URL}/auth/claims`,
  userAttrs: `${MAIN_DASHBOARD_API_URL}/auth/userAttrs`,
}

export default apiEndpoints