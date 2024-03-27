import axios from 'axios'
import {AuthModel, FirebaseUser} from './_models'

// export const API_URL = 'http://139.59.50.183:8080/api/v1'
// #PRODUCTION
// export const API_URL = 'https://dev.lighthouseuae.com/api/v1'
// #DEVELOPMENT
export const API_URL = 'https://dev.lighthouseuae.com/api/v1'

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/user/me`
export const LOGIN_URL = `${API_URL}/user/signin`
export const REGISTER_URL = `${API_URL}/user/signup`
export const REQUEST_PASSWORD_URL = `${API_URL}/user/forgot-password`
export const RESET_PASSWORD_URL = `${API_URL}/user/reset-password`
export const GOOGLE_LOGIN_URL = `${API_URL}/user/getgoogleauthurl`
export const GOOGLE_AUTH_CODE_URL = `${API_URL}/user/google-login`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN_URL, {
    email,
    password,
  })
}
export function googleLogin() {
  return axios.post(GOOGLE_LOGIN_URL)
}
export function sendGoogleAuthCode(code: string) {
  return axios.post(`${GOOGLE_AUTH_CODE_URL}?code=${code}`)
}
// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post<{message: string}>(REGISTER_URL, {
    email,
    firstName: firstname,
    lastName: lastname,
    password,
    confirmPassword: password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function forgotPassword(email: string) {
  return axios.post<{message: string}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function resetPassword(email: string, password: string, token: string) {
  return axios.post<{message: string}>(RESET_PASSWORD_URL, {
    email,
    newPassword: password,
    otp: token,
  })
}

export function verifySignup(email: string, otp: string) {
  return axios.post(`${API_URL}/user/verify-otp`, {email, otp})
}

export function changePassword(email: string, oldPassword: string, newPassword: string) {
  return axios.post<{message: string}>(`${API_URL}/user/change-password`, {
    email,
    oldPassword,
    newPassword,
  })
}

export function getUser(id: string) {
  return axios.get<FirebaseUser>(`${API_URL}/user/${id}`)
}

export function updateUser(id: string, data: any) {
  return axios.put(`${API_URL}/user/${id}`, data)
}
