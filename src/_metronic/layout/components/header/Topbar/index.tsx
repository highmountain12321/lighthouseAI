import { FC, useEffect } from 'react'
import { useAuth } from 'app/modules/auth'
import { useAppDispatch, useAppSelector } from 'app/redux/hooks'
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeModeSwitcher } from '../../../../partials'
import { KTIcon, toAbsoluteUrl } from '../../../../helpers'
import { IChatChunk, clearChatContent, setChatSearchText, setFilteredChatContents } from 'app/redux/features/chatbot-slice'
import "./styles.css"

const Topbar: FC = () => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const isPremium = currentUser?.profile?.role == 'paid';

  const _chatSearchText = useAppSelector(state => state.chatbot.chatSearchText);
  const _chatContents = useAppSelector(state => state.chatbot.chatContents);

  useEffect(() => {
    if (_chatSearchText === '') {
      dispatch(setFilteredChatContents(_chatContents));
    }
  }, [_chatSearchText, _chatContents]);

  const handleSearch = (text: string) => {
    dispatch(setChatSearchText(text))

    if (text.length > 0) {
      const filteredChats = _chatContents.filter((chat: IChatChunk) => {
        return chat.query.toLowerCase().includes(text.toLowerCase());
      });
      dispatch(setFilteredChatContents(filteredChats));
    } else {
      // If the text is empty, show all conversations in real-time
      dispatch(setFilteredChatContents(_chatContents));
    }
  };

  const displayStyle = /^\/chat-bot\/chat(\/.*)?$/.test(pathname) ? 'flex' : 'none';

  return (
    <div className='d-flex flex-shrink-0'>
      {/* begin::Search Chats */}
      <div className='ms-3'
        style={{
          display: displayStyle
        }}
      >
        <form
          data-kt-search-element='form'
          className='position-relative mb-lg-0 navbar_search_input'
          style={{
            width: 200,
          }}
          autoComplete='on'
        >
          <KTIcon
            iconName='magnifier'
            className='fs-2 text-lg-3 text-gray-800 position-absolute top-50 translate-middle-y ms-5'
          />
          {/*begin::Input*/}
          <input
            type='text'
            className='search-input form-control form-control-solid ps-13 dark-bg'
            name='search'
            value={_chatSearchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search...'
            data-kt-search-element='input'
            autoComplete='new-password'
          />
          {/*end::Input*/}
          {/*begin::Spinner*/}
          <span
            className='position-absolute top-50 end-0 translate-middle-y lh-0 me-5 d-none'
            data-kt-search-element='spinner'
          >
            <span className='spinner-border h-15px w-15px align-middle text-gray-400'></span>
          </span>
          {/*end::Spinner*/}
          {/*begin::Reset*/}
          <span
            className='btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4 d-none'
            data-kt-search-element='clear'
            onClick={() => {
              dispatch(setChatSearchText(''));
              dispatch(setFilteredChatContents(_chatContents));
            }}
          >
            <KTIcon iconName='cross' className=' fs-2 text-lg-1 me-0' />
          </span>
          {/*end::Reset*/}
        </form>
      </div>
      {/* end::Search Chats */}


      {/* begin::Invite user */}
      <div className='d-flex ms-3'>
        <Link
          to='/chat-bot/chat'
          className='btn btn-flex flex-center btn-primary w-40px h-40px pulse pulse-white btn-active-color-primary w-md-auto px-0 px-md-6'
          onClick={() => {
            dispatch(clearChatContent())
            localStorage.removeItem('currentConversationId')
          }}
        >
          <KTIcon iconName='plus' className='fs-2 text-white me-0 me-md-2' />
          <span className='pulse-ring' />
          <span className='d-none d-md-inline'>New Chat</span>
        </Link>
      </div>

      {/* Used for inviting friends forum */}
      {/* <div className='d-flex flex-shrink-0'>
    {/* begin::Invite user */}
      {/* <div className='d-flex ms-3'>
  <a
    href='#'
    className='btn btn-flex flex-center btn-primary w-40px h-40px pulse pulse-white btn-active-color-primary w-md-auto px-0 px-md-6'
    data-bs-toggle='modal'
    data-bs-target='#kt_modal_invite_friends'
  >
    <KTIcon iconName='plus' className='fs-2 text-white me-0 me-md-2' />
    <span className='pulse-ring' />
    <span className='d-none d-md-inline'></span>
  </a> */}
      {/* </div> */}
      {/* end::Invite user */}

      {/* begin::Create app */}
      <div className='ms-3 hide_mobile'>
        <RoleLockWrapper locked={!isPremium} showLock={false}
          // Apply a border radius to the button
          className='rounded-8'
        >
          <a
            href='#'
            className={'btn btn-flex flex-center btn-color-gray-700 bg-body btn-active-color-primary w-40px w-md-auto h-40px px-0 px-md-6 rounded-8' + (!isPremium ? 'disabled' : 'bg-body')}
            style={{
              backgroundColor: isPremium ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
            }}
            id='kt_toolbar_primary_button'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_create_app'
          >
            <KTIcon iconName='document' className='fs-2 text-primary me-0 me-md-2' />
            <span className='d-none d-md-inline'>New Project {!isPremium && <img src={toAbsoluteUrl('/media/custom/lock.png')} alt='lock icon' style={{ width: 16, height: 16 }} />}</span>
          </a>
        </RoleLockWrapper>
      </div>
      {/* end::Create app */}

      {/* begin::Theme mode */}
      <div className='d-flex align-items-center  ms-3'>
        <ThemeModeSwitcher toggleBtnClass=' flex-center bg-body btn-color-gray-600 btn-active-color-primary h-40px' />
      </div>
      {/* end::Theme mode */}

      {/* CHAT */}
      <div className='d-flex align-items-center ms-3'>
        {/* begin::Menu wrapper */}
        {/* <div
        className='btn btn-icon btn-primary w-40px h-40px pulse pulse-white'
        id='kt_drawer_chat_toggle'
      >
        <KTIcon iconName='message-text-2' className='fs-2' />
        <span className='pulse-ring' />
      </div> */}
        {/* end::Menu wrapper */}
      </div>
    </div >
  )
}

export { Topbar }
