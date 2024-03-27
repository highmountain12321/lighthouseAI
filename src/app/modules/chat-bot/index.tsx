import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Chat } from './components/Chat'

const chatBotCrumbs: Array<PageLink> = [
  {
    title: 'Home',
    path: '/',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ChatBot: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route
          path='chat'
          element={
            <>
              <PageTitle breadcrumbs={chatBotCrumbs}>LighthouseGPT</PageTitle>
              <Chat />
            </>
          }
        />
        <Route
          path='chat/:id'
          element={
            <>
              <PageTitle breadcrumbs={chatBotCrumbs}>LighthouseGPT</PageTitle>
              <Chat />
            </>
          }
        />
        {/* <Route index element={<Navigate to='/chat-bot/chat' />} /> */}
      </Route>
    </Routes>
  )
}

export default ChatBot
