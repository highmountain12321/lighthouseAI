import axios from 'axios'
import React, { useRef, useEffect, useState } from 'react'
import { verifySignup } from '../core/_requests'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../core/Auth'
import { setAuth } from '../core/AuthHelpers'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth as authFirebase } from '../../../../firebase'
import { sendEmailVerification } from 'firebase/auth'
import { enqueueSnackbar } from 'notistack'

const correctOTP = '123456' // validate from your server

interface IVerifyOtpState {
    email: string
}

function EmailVerification() {
    const { saveAuth, setCurrentUser, logout } = useAuth()
    const [loading, setLoading] = useState(false)

    const [user, loadingAuth, errorAuth] = useAuthState(authFirebase as any)

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
            const { data } = await verifySignup(email, otpValue)
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

    useEffect(() => {
        // alert("useEffect triggered" + user?.emailVerified)
        if (user && user.emailVerified === false) {
            // verifyEmail()
        } else {
            alert(user?.emailVerified)
            setOtpSuccess('Email Already Verified')
            enqueueSnackbar('Email Already Verified', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
            });

            // setTimeout(() => {
            navigate('/dashboard')
            // }, 2500)
        }
    }, [user?.emailVerified])

    const verifyEmail = async () => {
        if (user && user.emailVerified === false) {
            try {
                setLoading(true)
                setLoading(false)

                sendEmailVerification(user)
                    .then(() => {
                        // Email verification sent!
                        let msg = 'An email verification link has been sent to ' + user?.email;

                        enqueueSnackbar(msg, {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right',
                            },
                        });
                    });
            } catch (err) {
                setLoading(false)
                if (axios.isAxiosError(err)) setOtpError(err.response?.data.message)
                else setOtpError('An unexpected error occurred.')

                enqueueSnackbar(`An Error Occurred while sending email verification link : ${err}`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                });
            }
        }
    }

    const logOutUser = () => {
        logout()

        enqueueSnackbar('Logged Out Successfully', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            },
        });

        navigate('/auth/login')
    }

    const checkMe = () => {
        if (!loadingAuth && user) {
            if (user?.emailVerified) {
                setOtpSuccess('Email Verified Successfully')
                enqueueSnackbar('Email Verified Successfully', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                });

                // setTimeout(() => {
                navigate('/dashboard')
                // }, 500)
            } else {
                setOtpError('Email Not Verified. Please verify your email to continue')
                enqueueSnackbar('Email Not Verified. Please verify your email to continue', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                });
            }
        } else {
            enqueueSnackbar('Loading ...', {
                variant: 'info',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
            });
        }
    }

    return (
        <article className='w-full'>
            <p className='h2 font-weight-medium text-black mt-3'>OTP Verification</p>
            <p className='text-base text-black mt-3 p-3 rounded'>
                {user ? (
                    <>
                        {user.emailVerified ? ("Email Verified Successfully") : ("Email Not Verified. Please verify your email to continue")}
                    </>
                ) : (
                    <>User Not Logged In</>
                )}
            </p>

            <div className='flex' style={{ flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "fit-content",
                    // border: "1px solid blue",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}>
                    <button onClick={verifyEmail} className='btn btn-info'>Resend Verification Email</button>
                    {/* A Log out button */}
                    <button onClick={checkMe} style={{ marginLeft: "5px" }} className='btn btn-primary'>
                        I verified my email
                    </button>
                </div>
            </div>

            {/* <p className='text-base text-black mt-3 mb-3'>One Time Password (OTP)</p>

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
            </div> */}
            {/* <p className={`text-lg alert-info mt-3 ${otpSuccess ? 'd-block' : 'd-none'}`}>{otpSuccess}</p>
            <p className={`text-lg alert-danger mt-3 ${otpError ? 'd-block' : 'd-none'}`}>{otpError}</p> */}
        </article>
    )
}

export default EmailVerification
