import React, { FC, useState, useEffect, useRef } from 'react'
import { useAuth } from 'app/modules/auth'
import ReactMarkdown from 'react-markdown'
import TypewriterLocal from './TypewriterLocal'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { IChatChunk, clearChatContent, setChatSearchText } from 'app/redux/features/chatbot-slice'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { RoleLockWrapper } from 'app/pages/dashboard/DashboardWrapper'
import { MenuComponent } from '../../../../_metronic/assets/ts/components'
import { Conversation, SingleConversation } from '_metronic/layout/components/aside/Tabs/tabTypes'
import {
  continueConversation,
  getAllConversationsThunk,
  getConversation,
  postConversation,
  deleteConversationById
} from 'app/redux/thunks/conversationThunk'
import { clearConversationContent, setFilteredConversations } from 'app/redux/features/conversation-slice'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { useSnackbar } from 'notistack'
import { extractLetters } from 'app/modules/dashboard/components/methods'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth as authFirebase } from "../../../../firebase"
import "./Chat.css";
import Feedback from './Feedback';

export interface IButtonModel {
  icon: string
  text: string
  onClick?: () => void
}

const Chat = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // A ref to the last message element
  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  const _chatContents = useAppSelector((state) => state.chatbot.chatContents)
  const _filteredChatContents = useAppSelector((state) => state.chatbot.filteredChatContents)
  const _chatSearchText = useAppSelector((state) => state.chatbot.chatSearchText)
  const [chatModel, setChatModel] = useState('Researcher')
  const [chatQuery, setChatQuery] = useState('')
  // const [chatContent, setChatContent] = useState<IChatChunk[]>([]);
  const [isSubmit, setSubmit] = useState(false)
  const chatHistory = useRef<null | HTMLDivElement>(null)
  const [applyAnimation, setApplyAnimation] = useState<{
    id: string
    apply: boolean
  }>({
    id: '',
    apply: false,
  })
  const [submitting, setSubmitting] = useState(false);
  const [newChatId, setNewChatId] = useState('');

  const { currentUser, setCurrentUser } = useAuth()

  const [user, loadingAuth, errorAuth] = useAuthState(authFirebase)
  const isPremium = currentUser?.profile?.role == 'paid'
  const [startTyping, setStartTyping] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(true); // State variable to track snackbar visibility

  const _conversationContents = useAppSelector((state) => state.conversation.conversations)

  function conversationToPlainObject(conversation: Conversation): { [key: string]: unknown } {
    const { id, title, updated_at } = conversation

    // Map Conversation properties to corresponding keys in the plain object
    return {
      id,
      title,
      updated_at
    }
  }

  useEffect(() => {
    if (user && !loadingAuth && !errorAuth) {
      setCurrentUser(user as any)
    }
  }, [user, loadingAuth, errorAuth])

  useEffect(() => {
    dispatch(setFilteredConversations(_conversationContents))
    dispatch(setChatSearchText(''))
  }, [_conversationContents, id, pathname])

  useEffect(() => {
    // alert("Chats cleared")
    dispatch(clearChatContent())
  }, [pathname])

  useEffect(() => {
    let shouldNavigate = false;

    const navigateAfterSubmit = async () => {
      if (startTyping && isSubmit && newChatId !== '') {
        shouldNavigate = true;
        setNewChatId('');
        setStartTyping(false);
        setSubmit(false);
      } else {
        if (shouldNavigate) {
          // Both startTyping and isSubmit are false now
          await dispatch(getAllConversationsThunk('cal'))
          navigate(`/chat-bot/chat/${newChatId}`);
          shouldNavigate = false;
        }
      }
    };

    if (!startTyping && !isSubmit) {
      navigateAfterSubmit();
    }
  }, [startTyping, isSubmit, newChatId]);

  const fetchSingleConversationData = async (id: string) => {
    try {
      const single_conversation = (
        await dispatch(
          getConversation({
            conversationId: id,
          })
        )
      ).payload as SingleConversation[]

      // return single_conversation
    } catch (error) {
      // Handle errors if needed
    }
  }

  const fetchAllConversationsData: () => Promise<Conversation[]> = async () => {
    try {
      const all_conversations = (await dispatch(getAllConversationsThunk('cal')))
        .payload as Conversation[]

      return all_conversations
    } catch (error) {
      return []
    }
  }

  const getLatestConversation: () => Promise<Conversation> = async () => {
    try {
      const all_conversations = await fetchAllConversationsData()
      const latest_conversation = all_conversations[0] as Conversation

      return latest_conversation
    } catch (error) {
      return {} as Conversation
    }
  }

  useEffect(() => {
    if (id) {
      fetchSingleConversationData(id)
      // console.log('id found')

      // console.log('All Chats: ', _chatContents)
    } else {
      // console.log('No id found')
    }
  }, [id, pathname])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 50)
  }, [])

  useEffect(() => {
    if (chatHistory.current) {
      const foundElement: any = chatHistory.current.querySelector('.highlighted-word')
      if (foundElement) {
        chatHistory.current.scrollTop = foundElement.offsetTop - chatHistory.current.offsetTop
      }
    }
  }, [_chatContents, _chatSearchText])

  useEffect(() => {
    // Scroll to the last message when messages change
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    // console.log("useEffect",_filteredChatContents)
  }, [_filteredChatContents])

  const HighlightedSentence = ({ sentence, searchText }: { sentence: string; searchText: string }) => {
    const containerRef: any = useRef(null)

    useEffect(() => {
      const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const highlightedSentence = sentence.replace(
        new RegExp(escapedSearchText, 'gi'),
        (match: string) =>
          `<span class='highlighted-word' style='background-color: yellow;'>${match}</span>`
      )
      containerRef.current.innerHTML = highlightedSentence
    }, [sentence, searchText])

    return <span ref={containerRef} />
  }

  const ChatChunk: FC<IChatChunk> = ({ query, response, currentChatId, newId }) => {
    const getLastIndex = _chatContents.length - 1

    const [user, loadingAuth, errorAuth] = useAuthState(authFirebase)

    const ccid = currentChatId as number
    const randomId = localStorage.getItem('randomId') as string

    useEffect(() => {
      if (isSubmit === true && randomId === newId && ccid === getLastIndex) {
        setStartTyping(true)
      }
    }, [newId, isSubmit, randomId, ccid, getLastIndex])

    const handleTypingComplete = async () => {
      setStartTyping(false)
      localStorage.removeItem('randomId')

      if ((id === undefined || id === null || id === '') && newChatId !== '') {
        setTimeout(async () => {
          await dispatch(getAllConversationsThunk('cal'));
          await dispatch(clearChatContent())

          // Reset all things
          setNewChatId('');
          setStartTyping(false);
          setSubmit(false);

          navigate(`/chat-bot/chat/${newChatId}`);
        }, 2000);
      }
    }

    const highlightMatchingWords = (txt: string, searchTxt: string) => {
      const escapedSearchText = (searchTxt as string) ? searchTxt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''
      const highlightedText = (txt as string) ? (txt.replace(
        new RegExp(escapedSearchText, 'gi'),
        (match: string) =>
          `<span class='highlighted-word' style='background-color: yellow;'>${match}</span>`
      )) : ''
      return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
    }

    return (
      <div className='d-flex flex-column gap-2 align-items-start justify-content-center mt-3'>
        <div className='d-flex gap-2 align-items-center'>
          {/* {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} className='w-30px' style={{
              borderRadius: "5px"
            }} alt='not found Logo-1.png' />
          ) : ( */}
            <div className='d-flex align-items-center justify-content-center bg-info text-white h-30px w-30px border border-black border-1 rounded-circle text-uppercase'>
              {user?.displayName ? extractLetters(user?.displayName as string) : ''}
            </div>
          <h4 className='mb-0'>
            {highlightMatchingWords(query, _chatSearchText)}
          </h4>
        </div>
        <div className='d-flex gap-2 align-items-start'>
          <img
            src={toAbsoluteUrl('/media/logos/Logo-1.png')}
            className='w-30px'
            alt='not found Logo-1.png'
          />
          <div>
            {(newChatId !== '' &&
              (id === undefined ||
                id === null ||
                id === '')
            ) ? (
              <>
                <h5
                  ref={lastMessageRef}
                  style={{
                    fontWeight: 'normal',
                    wordSpacing: '0.2em',
                    lineHeight: '1.5em',
                  }}
                >
                  <TypewriterLocal
                    sentence={response}
                    delay={1}
                    startTyping={true}
                    onTypingComplete={handleTypingComplete}
                  />
                </h5>
              </>
            ) : (
              <>
                {(randomId === newId && ccid === getLastIndex) && (
                  <h5
                    ref={lastMessageRef}
                    style={{
                      fontWeight: 'normal',
                      wordSpacing: '0.2em',
                      lineHeight: '1.5em',
                    }}
                  >
                    <TypewriterLocal
                      sentence={response}
                      delay={1}
                      startTyping={randomId === newId}
                      onTypingComplete={handleTypingComplete}
                    />
                  </h5>
                )}
                {randomId !== newId && (
                  <h5
                    style={{
                      fontWeight: 'normal',
                      wordSpacing: '0.2em',
                      lineHeight: '1.5em',
                    }}
                    ref={lastMessageRef}
                  >
                    <ReactMarkdown>
                      {response}
                    </ReactMarkdown>
                  </h5>
                )}
              </>
            )}
          </div>
        </div>
      </div >
    )
  }

  const ModelButton: FC<IButtonModel> = ({ icon, text, onClick }) => (
    <button
      onClick={() => {
        if (onClick) {
          setChatModel(text)
          onClick()
        } else {
          setChatModel(text)
        }
      }}
      className='d-flex gap-2 px-5 py-5 align-items-center justify-content-center rounded-md fw-bold border-0'
      style={{
        backgroundColor: chatModel === text ? '#ffffff' : 'transparent',
        borderRadius: '14px',
        boxShadow: chatModel === text ? 'rgba(112, 144, 176, 0.2) 6px 6px 29px' : '',
        color: '#1b254b',
        fontSize: '18px',
        lineHeight: '27px',
      }}
    >
      <div
        className='d-flex align-items-center justify-content-center rounded-circle'
        style={{
          width: '39px',
          height: '39px',
          background: 'linear-gradient(#04c8c8 0%, #d8f1f1 100%)',
        }}
      >
        <img alt='Pic' className='w-20px h-20px' src={toAbsoluteUrl(icon)} />
      </div>
      <span className='d-none d-md-inline'>{text}</span>
    </button>
  )

  const onSubmitHandler = async () => {

    setShowSnackbar(true); // Reset state variable to indicate snackbar has not been shown

    if (chatQuery === "") {
      enqueueSnackbar('Please enter a message to send', {
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      })
      return
    }

    try {
      localStorage.removeItem('randomId')
      setSubmit(true)

      let newRandomId = Math.random().toString(36).substring(7)
      console.log("======")

      if (id) {
        // Reset the chat field
        setChatQuery('')

        await dispatch(continueConversation({ prompt: chatQuery, id: id, randomId: newRandomId }))
        setApplyAnimation({
          id: newRandomId,
          apply: true,
        })
      } else {
        let newRandomId = Math.random().toString(36).substring(7);

        const new_conversation_chat_response = await dispatch(postConversation({ prompt: chatQuery, randomId: newRandomId }))

        console.log("new_conversation_chat_response ", new_conversation_chat_response.payload)

        let new_chat_id = new_conversation_chat_response.payload.conversation_id

        setNewChatId(new_chat_id)

        localStorage.setItem('currentConversationId', new_chat_id)
        /* navigate(`/chat-bot/chat/${new_chat_id}`) */
      }

      setSubmit(false)
      setChatQuery('')
    } catch (error) {
      setSubmit(false)
      setChatQuery('')
      console.error('Error making POST request:', error)
    }
  }

  const exportChat = () => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true })
    const csv = generateCsv(csvConfig)(_conversationContents.map(conversationToPlainObject))
    download(csvConfig)(csv)
  }

  return (
    <div className='d-flex flex-column'>
      <div>
        <div className='w-full d-flex align-items-center justify-content-center gap-2 mb-1 '>
          <ModelButton icon='/media/logos/researcher-icon.png' text='Researcher' />

          <RoleLockWrapper locked={!isPremium}>
            <ModelButton icon='/media/logos/consultant-icon.png' text='Consultant' />
          </RoleLockWrapper>
          <RoleLockWrapper locked={!isPremium}>
            <ModelButton icon='/media/logos/advisor-icon.png' text='Advisor' />
          </RoleLockWrapper>
        </div>
        {/* <div className='mt-8' style={{ height: '40px' }}>
                    <div
                        className='d-flex justify-content-center align-items-center menu menu-column menu-fit menu-rounded menu-title-gray-600 menu-icon-gray-400 menu-state-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500 fw-bold fs-5 px-6 my-5 my-lg-0'
                        id='kt_aside_menu'
                        data-kt-menu='true'
                    >
                        <div id='kt_aside_menu_wrapper' className='menu-fit z-3' style={{ width: '210px', fontSize: '1.1rem', backgroundColor: '#f3f6f9', zIndex: 1000 }}>
                            <AsideMenuItemWithSub to='/apps/chat' title='No plugins added' >
                                <AsideMenuItem to='' title='This is cool text example.' />
                            </AsideMenuItemWithSub>
                        </div>
                    </div>
                </div> */}
      </div>
      <div className='position-relative'>
        {(_filteredChatContents.length === 1 && (id === undefined || id === null || id === '')) ? (
          <>
            {(
              _filteredChatContents.length !== 0
              &&
              _conversationContents.length !== 0
            ) ? (
              <div ref={chatHistory} style={{ maxHeight: 'calc(100vh - 320px)', overflowY: 'scroll' }}>
                {_filteredChatContents.map((chat: IChatChunk, index: number) => (
                  <ChatChunk key={index} {...chat} currentChatId={index} />
                ))}
              </div>
            ) : (
              <div
                className='d-flex justify-content-center align-items-center'
                style={{ height: 'calc(100vh - 320px)' }}
              >
                {/* Content Area */}
                <img
                  src={toAbsoluteUrl('/media/logos/Logo-1.png')}
                  className='w-150px w-md-200px'
                  alt='not found Logo-1.png'
                />
              </div>
            )}
          </>
        ) : (
          <div className='message-container'>
            {(
              _filteredChatContents.length !== 0
              &&
              id !== undefined
              &&
              id !== null
              &&
              id !== ''
              &&
              _conversationContents.length !== 0
            ) ? (
              <div ref={chatHistory} style={{ maxHeight: 'calc(100vh - 320px)', overflowY: 'scroll' }}>
                {_filteredChatContents.map((chat: IChatChunk, index: number) => (
                  <div>
                    <ChatChunk key={index} {...chat} currentChatId={index} />
                    {
                      (chat.response !== "I'm thinking...")
                      ?
                      (
                        <div className='feedback-bar'>
                          <Feedback key={chat.newId} messageId={chat.newId}/>
                        </div>
                      )
                      :
                      (
                        <></>
                      )
                    }
                    
                  </div>
                ))}
              </div>
            ) : (
              <div
                className='d-flex justify-content-center align-items-center'
                style={{ height: 'calc(100vh - 320px)' }}
              >
                {/* Content Area */}
                <img
                  src={toAbsoluteUrl('/media/logos/Logo-1.png')}
                  className='w-150px w-md-200px'
                  alt='not found Logo-1.png'
                />
                
              </div>
            )}
          </div>
        )}
        <div
          className={`w-100 position-absolute ${_chatContents.length !== 0 && "chatMessageInputDiv"} chatMessageInputDiv`}
        >
          <div className='d-flex align-items-center justify-content-center gap-4 px-8 px-md-12 chatMessage'>
            <textarea
              className='form-control form-control-flush ps-10 font-weight-bold chatMessageInput'
              style={{ border: '1px solid #e2e8f0', borderRadius: '45px', color: '#1b254b' }}
              name='chat'
              value={chatQuery}
              disabled={isSubmit || startTyping}
              placeholder={(startTyping || isSubmit) ? 'Please wait while we are processing your request' : 'Type your message here...'}
              onChange={(e) => {
                setChatQuery(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmitHandler()
              }}
            />
            <button
              type='button'
              className='btn btn-primary d-none d-md-block w-120px chatSubmitButton'
              disabled={isSubmit || startTyping}
              onClick={() => {
                if (!isSubmit) {
                  onSubmitHandler()
                } else {
                  alert('Please wait while we are processing your request')
                }
              }}
            >
              {isSubmit || startTyping ? (
                <span className='spinner-border spinner-border-sm align-middle'></span>
              ) : (
                'Submit'
              )}
            </button>
            <button
              type='button'
              className='btn btn-primary d-block d-md-none w-60px chatSubmitButton'
              disabled={isSubmit || startTyping}
              onClick={() => {
                if (!isSubmit) {
                  onSubmitHandler()
                } else {
                  enqueueSnackbar('Please wait while we are processing your request', {
                    variant: 'info',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'right',
                    },
                  })
                }
              }}
            >
              {isSubmit || startTyping ? (
                <span className='spinner-border spinner-border-sm align-middle'></span>
              ) : (
                '↑'
              )}
            </button>
          </div>
          
          {/* <div className='d-flex align-items-center justify-content-center mt-12'>
                        <span style={{ color: '#718096', fontSize: '12px' }}>LighthouseGPT may produce inaccurate information about people, places, or facts.</span>
                        <a className='text-decoration-underline fw-500' style={{ color: '#1b254b' }} href='https://help.openai.com/en/articles/6825453-chatgpt-release-notes'>ChatGPT May 12 Version</a>
                    </div> */}
        </div>
      </div>
    </div>
  )
}

export { Chat }