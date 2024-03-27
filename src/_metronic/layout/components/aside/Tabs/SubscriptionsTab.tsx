import {toAbsoluteUrl} from '../../../../helpers'

/* eslint-disable jsx-a11y/anchor-is-valid */
const SubscriptionsTab = () => (
  <div className='mx-5'>
    {/*begin::Container*/}
    <div className='text-center pt-10 mb-20'>
      {/*begin::Title*/}
      <h2 className='fs-2 fw-bolder mb-7'>My Subscription</h2>
      {/*end::Title*/}

      {/*begin::Description*/}
      <p className='text-gray-400 fs-4 fw-bold mb-10'>
        You are currenlty on the Free-Trail plan
        <br />
        Upgrade your plan to have access to more powerful features
      </p>
      {/*end::Description*/}

      {/*begin::Action*/}
      <a href='#' className='btn btn-primary'>
        Upgrade Plan 
      </a>
      {/*end::Action*/}
    </div>
    {/*end::Container*/}

    {/*begin::Illustration*/}
    <div className='text-center px-4'>
      <img
        src={toAbsoluteUrl('/media/illustrations/sigma-1/18.png')}
        alt=''
        className='mw-100 mh-300px'
      />
    </div>
    {/*end::Illustration*/}
  </div>
)

export {SubscriptionsTab}
