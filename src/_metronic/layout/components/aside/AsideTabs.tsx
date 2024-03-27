/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import clsx from 'clsx'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { KTIcon } from '../../../helpers'
import { useLocation, useNavigate } from 'react-router-dom';
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper';

const tabs: ReadonlyArray<{ id: number, link: string; icon: string; tooltip: string, navigate?: boolean }> = [
  {
    id: 1,
    link: '/chat-bot/chat',
    icon: 'add-files',
    tooltip: 'LighthouseGPT',
    navigate: true,
  },
  {
    id: 2,
    link: '/dashboard',
    icon: 'element-11',
    tooltip: 'Dashboard',
    navigate: true,
  },
  // {
  //   link: 'tasks',
  //   icon: 'shield-tick',
  //   tooltip: 'Tasks',
  // },
  {
    id: 3,
    link: 'notifications',
    icon: 'abstract-26',
    tooltip: 'Notifications',
    navigate: false,
  },
  {
    id: 4,
    link: 'subscription',
    icon: 'purchase',
    tooltip: 'Subscription',
    navigate: false
  },
  // {
  //   link: 'menu',
  //   icon: 'briefcase',
  //   tooltip: 'Menu',
  // }
]

type Props = {
  link: string
  setLink: Dispatch<SetStateAction<string>>
}

const AsideTabs: FC<Props> = ({ link, setLink }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].link === pathname) {
        setLink(pathname);
        break;
      }
    }

  }, [pathname])

  return (
    <div
      className='hover-scroll-y mb-10'
      data-kt-scroll='true'
      data-kt-scroll-activate='{default: false, lg: true}'
      data-kt-scroll-height='auto'
      data-kt-scroll-wrappers='#kt_aside_nav'
      data-kt-scroll-dependencies='#kt_aside_logo, #kt_aside_footer'
      data-kt-scroll-offset='0px'
    >
      {/* begin::Nav */}
      <ul className='nav flex-column' id='kt_aside_nav_tabs'>
        {/* begin::Nav item */}
        {tabs.map((t, i) => (
          <li key={t.link} className='mt-2'
            title={t.tooltip}
          >
            {/* begin::Nav link */}
            <a
              className={clsx(
                'nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light',
                { active: ((t.navigate) ? (t.link === link && t.id === i + 1) : (t.link === link)) }
              )}
              onClick={() => {
                if (t.navigate) {
                  setLink(t.link)
                  navigate(t.link);
                }
              }}
            >
              {t.navigate ? (
                <KTIcon iconName={t.icon} className='fs-2x' />
              ) : (
                <RoleLockWrapper locked={true}>
                  <KTIcon iconName={t.icon} className='fs-2x' />
                </RoleLockWrapper>
              )}
            </a>
            {/* end::Nav link */}
          </li>
        ))}
        {/* end::Nav link */}
      </ul>
      {/* end::Tabs */}
    </div>
  )
}

export { AsideTabs }
