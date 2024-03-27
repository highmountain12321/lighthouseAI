// ** JWT Service Import
import JwtService from './axiosInstance'
// ** Export Service as useJwt
export default function useJwt(jwtOverrideConfig: any) {
  const jwt = new JwtService(jwtOverrideConfig)
  return {
    jwt
  }
}
