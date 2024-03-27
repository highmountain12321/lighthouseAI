import React from 'react';
import { Link } from 'react-router-dom';
import { KTIcon, toAbsoluteUrl } from '../../../../helpers';
import { Dropdown1, Search } from '../../../../partials';

const authors: ReadonlyArray<{ image: string; name: string; topic: string }> = [
  {
    image: '/media/svg/avatars/001-boy.svg',
    name: 'John Doe',
    topic: 'Briviba SaaS',
  },
  {
    image: '/media/svg/avatars/002-girl.svg',
    name: 'Jane Smith',
    topic: 'Vine Quick Reports',
  },
  {
    image: '/media/svg/avatars/003-girl-1.svg',
    name: 'Amanda Johnson',
    topic: 'KC Account CRM',
  },
  {
    image: '/media/svg/avatars/004-boy-1.svg',
    name: 'Daniel Williams',
    topic: 'Baloon SaaS',
  },
  {
    image: '/media/svg/avatars/005-girl-2.svg',
    name: 'Emily Brown',
    topic: 'Most Cloudy UMC',
  },
  {
    image: '/media/svg/avatars/006-girl-3.svg',
    name: 'Olivia Wilson',
    topic: 'Disqus Forum',
  },
  {
    image: '/media/svg/avatars/007-boy-2.svg',
    name: 'Michael Garcia',
    topic: 'Proove Quick CRM',
  },
];

const AuthorsTab = () => (
  <div className='m-0'>
    {/* begin::Toolbar */}
    <div className='d-flex mb-10'>
      <Search />
      {/* begin::Filter */}
      <div className='flex-shrink-0 ms-2'>
        {/* begin::Menu toggle */}
        <button
          type='button'
          className='btn btn-icon btn-bg-light btn-active-icon-primary btn-color-gray-400'
          data-kt-menu-trigger='click'
          data-kt-menu-placement='bottom-end'
        >
          <KTIcon iconName='filter' className='fs-2' />
        </button>
        {/* end::Menu toggle */}
        <Dropdown1 />
      </div>
      {/* end::Filter */}
    </div>
    {/* end::Toolbar */}

    {/*begin::Authors*/}
    <div className='m-0'>
      {/*begin::Heading*/}
      <h1 className='text-gray-800 fw-bold mb-6 mx-5'>Recent Projects</h1>
      {/*end::Heading*/}

      {/*begin::Items*/}
      <div className='mb-10'>
        {authors.map((a) => (
          <Link
            key={a.name}
            to='/crafted/pages/profile/authors'
            className='custom-list d-flex align-items-center px-5 py-4'
          >
            {/*begin::Symbol*/}
            <div className='symbol symbol-40px me-5'>
              <span className='symbol-label'>
                <img
                  src={toAbsoluteUrl(a.image)}
                  alt={a.name}
                  className='h-50 align-self-center'
                />
              </span>
            </div>
            {/*end::Symbol*/}

            {/*begin::Description*/}
            <div className='d-flex flex-column flex-grow-1'>
              {/*begin::Name*/}
              <h5 className='custom-list-title fw-bold text-gray-800 mb-1'>{a.name}</h5>
              {/*end::Name*/}

              {/*begin::Topic*/}
              <span className='text-gray-400 fw-bold'>{a.topic}</span>
              {/*end::Topic*/}
            </div>
            {/*begin::Description*/}
          </Link>
        ))}
      </div>
      {/*end::Items*/}
    </div>
    {/*end::Authors*/}
  </div>
);

export { AuthorsTab };
