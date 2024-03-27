import React, {FC} from 'react'
import {KTIcon} from '../../../../../_metronic/helpers'
import {Link} from 'react-router-dom'

const Step5: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-8 pb-lg-10'>
        <h2 className='fw-bolder text-dark'>You Are Done!</h2>

        <div className='text-gray-400 fw-bold fs-6'>
          If you need more info, please
          <Link to='/auth/login' className='link-primary fw-bolder'>
            {' '}
            Sign In
          </Link>
          .
        </div>
      </div>

      <div className='mb-0'>
        <div className='fs-6 text-gray-600 mb-5'>
        Congratulations on taking the next step! Whether seeking your dream home or mastering the real estate market, our platform empowers your ambitions. Explore, analyze, and make informed decisions with confidence with LighthouseGPT. Your property adventure starts now.
        </div>

        <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6'>
          <KTIcon iconName='information-5' className='fs-2tx text-warning me-4' />
          <div className='d-flex flex-stack flex-grow-1'>
            <div className='fw-bold'>
              <h4 className='text-gray-800 fw-bolder'>We need your attention!</h4>
              <div className='fs-6 text-gray-600'>
                To review your invoice please check your inbox
                <a href='https://www.outlook.com' className='fw-bolder'>
                  {' '}
                  Outlook or
                </a>
                <a href='https://www.gmail.com' className='fw-bolder'>
                  {' '}
                  Gmail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {Step5}
