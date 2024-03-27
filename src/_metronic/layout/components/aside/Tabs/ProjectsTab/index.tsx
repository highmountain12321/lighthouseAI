import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { KTIcon } from '../../../../../helpers'
import { useAuth } from 'app/modules/auth'
import { enqueueSnackbar } from 'notistack'
import { Dropdown1, Search } from '../../../../../partials'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { getAllConversationsThunk, deleteConversationById } from 'app/redux/thunks/conversationThunk'
import { Conversation } from '../tabTypes'
// @ts-ignore
import interfaceSound from '../../../../../../app/media/sounds/conversation_change/interface.ogg'
import AudioPlayer from '../../../common/AudioPlayer'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../../../../firebase'
import "./style.css"

const ProjectsTab = () => {
    const { pathname } = useLocation()
    const dispatch = useAppDispatch()

    const { currentUser, setCurrentUser } = useAuth()

    const [user, loadingAuth, errorAuth] = useAuthState(auth)

    const [isPlaying, setIsPlaying] = useState(false)

    const [currentDeleteButtonId, setCurrentDeleteButtonId] = useState('')

    const conversationRef = useRef<HTMLAnchorElement | null>(null)

    const _conversationContents = useAppSelector((state) => state.conversation.conversations)

    const localStorageCurrentConversationId = localStorage.getItem('currentConversationId')

    const fetchData = async () => {

        if (user) {
            const token = await user.getIdToken()
            Cookies.set('gid_token', token as string)

            let tokenFromCookies = Cookies.get('gid_token')
            if (tokenFromCookies) {
                try {
                    const all_conversations = (await dispatch(getAllConversationsThunk('cal')))
                        .payload as Conversation[]

                    return all_conversations
                } catch (error) {
                }
            }
            else {
                enqueueSnackbar('No Auth Token found', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                },
                )
            }
        }
    }

    const deleteConversationByIdMethod = async (conversationId: string) => {

        const current_conversation: Conversation = _conversationContents.find((conversation: Conversation) => conversation.id === conversationId)

        try {
            const response = await dispatch(deleteConversationById(conversationId))

            let status_code = (response) ? (response.payload.status) : 0
            if (status_code === 200) {
                enqueueSnackbar('Conversation Deleted Successfully', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            } else {
                enqueueSnackbar(`Error Deleting Conversation : ${current_conversation.title}`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            }
        } catch (error) {
            // Handle errors if needed

            enqueueSnackbar(`Error Deleting Conversation : ${current_conversation.title}, Error: ${error}`, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            })
        }
    }

    useEffect(() => {
        if (user && !loadingAuth && !errorAuth) {
            setCurrentUser(user as any)

            fetchData()
        }
    }, [user, loadingAuth, errorAuth])

    useEffect(() => {
        // Scroll into view when the component mounts or conversation ID changes
        if (localStorageCurrentConversationId && conversationRef.current) {
            conversationRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [localStorageCurrentConversationId, conversationRef])

    return (
        <div className='m-0'>
            <AudioPlayer audioSrc={interfaceSound} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
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

            {/*begin::Projects*/}
            <div className='m-0'>
                {/*begin::Heading*/}
                <h1 className='text-gray-800 fw-bold mb-6 mx-5'>Recent Sessions</h1>
                {/*end::Heading*/}

                {/*begin::Items*/}
                <div
                    className='mb-10'
                    style={{
                        overflowY: 'auto',
                        height: '260px',
                    }}
                >
                    {_conversationContents.length > 0 ? (
                        <>
                            {_conversationContents.map((conversation: Conversation, index: number) => (
                                <Link
                                    key={index}
                                    to={`/chat-bot/chat/${conversation.id}`}
                                    ref={conversationRef}
                                    className="custom-list d-flex align-items-center px-4 py-1 mt-1 hover-bg-light-primary rounded"
                                    style={{
                                        backgroundColor:
                                            (localStorageCurrentConversationId === conversation.id) || (currentDeleteButtonId === conversation.id) ? '#E8F0FE' : '',
                                        width: '99%',
                                    }}
                                    onClick={() => {
                                        localStorage.setItem('currentConversationId', conversation.id)
                                    }}
                                    onMouseOver={() => setCurrentDeleteButtonId(conversation.id)}
                                    onMouseOut={() => setCurrentDeleteButtonId('')}
                                >
                                    {/*begin::Symbol*/}
                                    <div
                                        className='symbol symbol-40px me-5'
                                        id={`${conversation.id}`}
                                        onClick={() => setIsPlaying(true)}
                                    >
                                        <span className='symbol-label'>
                                            <span className='symbol-label fs-1 fw-light text-success'>{index + 1}</span>
                                        </span>
                                    </div>
                                    {/*end::Symbol*/}

                                    {/*begin::Description*/}
                                    <div className='d-flex flex-column flex-grow-1'>
                                        {/*begin::Title*/}
                                        <h5
                                            className={`custom-list-title font-light text-gray-800 mb-1
                                            ${localStorageCurrentConversationId === conversation.id
                                                    ? 'text-primary'
                                                    : 'text-hover-primary'
                                                } conversation_title`}
                                        >
                                            {conversation.title}
                                        </h5>
                                        {/*end::Title*/}

                                    </div>
                                    {/*begin::Description*/}

                                    <div>
                                        {(currentDeleteButtonId === conversation.id) ? (
                                            <button
                                                className='btn btn-icon btn-active-icon-primary btn-color-gray-400'
                                                onClick={() => deleteConversationByIdMethod(conversation.id)}
                                            >
                                                <KTIcon iconName='trash' className='fs-2' />
                                            </button>
                                        ) : (
                                            <button
                                                className='btn btn-icon btn-active-icon-primary btn-color-gray-400 invisible'
                                                onClick={() => deleteConversationByIdMethod(conversation.id)}
                                            >
                                                <KTIcon iconName='trash' className='fs-2' />
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </>
                    ) : (
                        <div className='text-center'>
                            <h3 className='text-gray-800 fw-bold mb-6 mx-5'>No Recent Sessions</h3>
                        </div>
                    )}
                </div>
                {/*end::Items*/}
            </div>
            {/*end::Projects*/}
        </div>
    )
}

export { ProjectsTab }
