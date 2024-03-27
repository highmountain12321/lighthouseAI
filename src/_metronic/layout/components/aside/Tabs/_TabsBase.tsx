import { FC, useEffect } from 'react'
import { AuthorsTab } from './AuthorsTab'
import { MenuTab } from './MenuTab'
import { NotificationsTab } from './NotificationsTab'
import { ProjectsTab } from './ProjectsTab'
import { SubscriptionsTab } from './SubscriptionsTab'
import { TasksTab } from './TasksTab'
import { Link, useParams } from 'react-router-dom'
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper'
import { clearChatContent } from 'app/redux/features/chatbot-slice'
import { useDispatch } from 'react-redux'

type Props = {
  link: string
}

const SelectedTab: FC<Props> = ({ link }) => {
  switch (link) {
    case 'projects':
      return <ProjectsTab />
    case 'menu':
      return <MenuTab />
    case 'subscription':
      return (
        <RoleLockWrapper locked={true}>
          <SubscriptionsTab />
        </RoleLockWrapper>)
    case 'tasks':
      return <TasksTab />
    case 'notifications':
      return <NotificationsTab />
    case 'authors':
      return <AuthorsTab />
    default:
      return <ProjectsTab />
  }
}

const TabsBase: FC<Props> = ({ link }) => {
  const dispatch = useDispatch();

  return (
    <div className='d-flex h-100 flex-column'>
      {/* begin::Wrapper */}
      <div
        className='flex-column-fluid'
        data-kt-scroll='true'
        data-kt-scroll-activate='true'
        data-kt-scroll-height='auto'
        data-kt-scroll-wrappers='#kt_aside_wordspace'
        data-kt-scroll-dependencies='#kt_aside_secondary_footer'
        data-kt-scroll-offset='0px'
      >
        {/* begin::Tab content */}
        <div className='tab-content'>
          <div
            className='tab-pane fade active show'
            id={`kt_aside_nav_tab_${link}`}
            role='tabpanel'
          >
            <SelectedTab link={link} />
          </div>
        </div>
        {/* end::Tab content */}
      </div>
      {/* end::Wrapper */}
      {/* begin::Footer */}
      <div className='flex-column-auto pt-10 px-5' id='kt_aside_secondary_footer'>
        <Link
          to={'/chat-bot/chat'}
          onClick={() => {
            dispatch(clearChatContent())
            localStorage.removeItem('currentConversationId')
          }}
          // target='_blank'
          className='btn btn-color-gray-800 btn-flex btn-active-color-white flex-center w-100 ripple'
          style={{ backgroundColor: '#87CEEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  // Added Flexbox properties
          data-bs-toggle='tooltip'
          data-bs-custom-class='tooltip-dark'
          data-bs-trigger='hover'
          data-bs-offset='0,5'
          data-bs-dismiss-='click'
        >
          <span className='btn-label' style={{ fontSize: '35px', fontWeight: 'bold' }}>+</span>
          <span style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '-3px' }}>New Chat</span>  {/* Made 'New Chat' bold and added spacing between '+' and 'New Chat' */}
        </Link>
      </div>
      {/* end::Footer */}
    </div>
  )
}

export { TabsBase }
