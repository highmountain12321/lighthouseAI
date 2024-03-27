import { configureStore } from '@reduxjs/toolkit'

import profileReducer from './features/profile-slice'

import userReducer from './features/user-slice'
import dashboardReducer from './features/dashboard-slice'
import chatbotReducer from './features/chatbot-slice'
import conversationReducer from './features/conversation-slice'

export const store: any = configureStore({
  reducer: {
    profile: profileReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    chatbot: chatbotReducer,
    conversation: conversationReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
