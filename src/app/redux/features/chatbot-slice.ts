// chatbot-slice.js
import { createSlice } from '@reduxjs/toolkit'
export type ChatQueryType = {
  message: string
  id: string
  createdAt: string
}
export interface IChatChunk {
  query: string
  response: string
  queryDate: string
  responseDate: string
  newId: string
  currentChatId?: number
}
const chatbotSlice = createSlice({
  name: 'chat-bot',
  initialState: {
    sessions: null,
    currentSession: null,
    chatContents: [] as IChatChunk[],
    filteredChatContents: [] as IChatChunk[],
    chatSearchText: '' as string,
    loading: false,
    error: null,
  },
  reducers: {
    addChatContentChunk: (state, action) => {
      const { chunkText, extra } = action.payload

      // alert("Chunk text is " + chunkText + " and extra message is " + extra.message)
      const prev = state.chatContents
      if (prev && prev.length > 0 && prev[prev.length - 1].query === extra.message) {
        // Update the last chat content with the new chunk
        state.chatContents = prev.map((content, index) =>
          index === prev.length - 1 ? { ...content, response: content.response + chunkText } : content
        )
      } else {
        // Add new chat content
        state.chatContents = [
          ...(prev || []),
          {
            query: extra.message,
            response: chunkText,
            queryDate: new Date().toISOString(),
            responseDate: new Date().toISOString(),
            newId: extra.id,
          },
        ]
      }
    },
    setChatContentChunkById: (state, action) => {
      const { chunkText, extra } = action.payload
      const prev = state.chatContents

      const chatId = extra.id

      // Now match the chatId with the chat content and update the response
      state.chatContents = prev.map((content, index) =>
        content.newId === chatId ? { ...content, response: chunkText } : content
      )

      // Update the filtered chat contents
      state.filteredChatContents = state.chatContents
    },
    setChatSearchText: (state, action: { payload: string }) => {
      state.chatSearchText = action.payload
    },
    setFilteredChatContents: (state, action: { payload: IChatChunk[] }) => {
      state.filteredChatContents = action.payload
    },
    clearChatContent: (state) => {
      state.chatContents = []
    },
  },
})

export const addChatContentChunk = chatbotSlice.actions.addChatContentChunk
export const setChatContentChunk = chatbotSlice.actions.setChatContentChunkById
export const clearChatContent = chatbotSlice.actions.clearChatContent
export const setChatSearchText = chatbotSlice.actions.setChatSearchText
export const setFilteredChatContents = chatbotSlice.actions.setFilteredChatContents

export default chatbotSlice.reducer
