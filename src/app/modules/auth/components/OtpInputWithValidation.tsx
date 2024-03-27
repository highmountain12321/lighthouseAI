import axios from 'axios'
import React, {useRef, useEffect, useState} from 'react'
import {verifySignup} from '../core/_requests'
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from '../core/Auth'
import {setAuth} from '../core/AuthHelpers'

const correctOTP = '123456' // validate from your server

interface IVerifyOtpState {
  email: string
}

function OtpInputWithValidation() {
  const {saveAuth, setCurrentUser} = useAuth()
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as IVerifyOtpState
  // const email = state.email
  const numberOfDigits = 6
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(''))
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null)
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(value: string, index: number) {
    let newArr = [...otp]
    newArr[index] = value
    setOtp(newArr)

    if (value && index < numberOfDigits - 1) {
      const nextInput = otpBoxReference.current[index + 1]
      if (nextInput !== null) {
        nextInput.focus()
      }
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pastedText = event.clipboardData.getData('text').slice(0, numberOfDigits)

    // Split the pasted text into an array and fill the rest with empty strings
    const updatedOtp = pastedText
      .split('')
      .concat(new Array(numberOfDigits - pastedText.length).fill(''))

    setOtp(updatedOtp)
  }
  function handleBackspaceAndEnter(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === 'Backspace' && !event.currentTarget.value && index > 0) {
      const nextInput = otpBoxReference.current[index - 1]
      if (nextInput !== null) {
        nextInput.focus()
      }
    }
    if (event.key === 'Enter' && event.currentTarget.value && index < numberOfDigits - 1) {
      const nextInput = otpBoxReference.current[index + 1]
      if (nextInput !== null) {
        nextInput.focus()
      }
    }
  }

  // useEffect(() => {
  //   const otpValue = otp.join('')
  //   if (otpValue.length === numberOfDigits) {
  //     // Send OTP to server for verification
  //     verifyOtp(email, otpValue)
  //   }
  // }, [otp])

  const verifyOtp = async (email: string, otpValue: string) => {
    try {
      setOtpSuccess(null)
      setOtpError(null)
      const {data} = await verifySignup(email, otpValue)
      setOtpSuccess(data.message)

      // setTimeout(() =>{
      //   navigate('/auth/login')
      // }, 2500)

      const user = data.user
      const token = data.token
      const refreshToken = data.refreshToken
      setOtpSuccess('Otp verified successfully')
      setTimeout(() => {
        saveAuth(token)
        setCurrentUser(user)
      }, 2500)
    } catch (err) {
      if (axios.isAxiosError(err)) setOtpError(err.response?.data.message)
      else setOtpError('An unexpected error occurred.')
      // saveAuth(undefined)
      // setCurrentUser(undefined)
    }
  }
  return (
    <article className='w-full'>
      <p className='h2 font-weight-medium text-black mt-3'>OTP Verification</p>
      <p className='text-base text-black mt-3 p-3 rounded'>
        Secure Access: Please enter the One-Time Password (OTP) sent to your registered mobile
        number or email address. This extra step of verification ensures that only you have access
        to your account. The OTP is valid for 5 minutes. If you did not receive the OTP, you can
        request a new one. Remember, never share your OTP with anyone for your security.
      </p>

      <p className='text-base text-black mt-3 mb-3'>One Time Password (OTP)</p>

      <div className='d-flex align-items-center gap-3'>
        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            maxLength={1}
            onPaste={handlePaste}
            onChange={(event) => handleChange(event.target.value, index)}
            onKeyUp={(event) => handleBackspaceAndEnter(event, index)}
            ref={(reference) => (otpBoxReference.current[index] = reference)}
            className={`form-control w-25 h-auto text-black p-3 rounded d-block bg-light`}
          />
        ))}
      </div>
      <p className={`text-lg alert-info mt-3 ${otpSuccess ? 'd-block' : 'd-none'}`}>{otpSuccess}</p>
      <p className={`text-lg alert-danger mt-3 ${otpError ? 'd-block' : 'd-none'}`}>{otpError}</p>
    </article>
  )
}

export default OtpInputWithValidation
