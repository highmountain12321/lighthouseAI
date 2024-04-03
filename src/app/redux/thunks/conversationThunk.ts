import JwtService from '../../axios/usejwt'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  addChatContentChunk,
  clearChatContent,
  setChatContentChunk,
  setFilteredChatContents,
} from '../features/chatbot-slice'
import { addConversationChunk, clearConversationContent, deleteConversationByIdSlice, updateFeedback } from '../features/conversation-slice'
import { Conversation } from '_metronic/layout/components/aside/Tabs/tabTypes'

const { jwt } = JwtService({})

export const getAllConversationsThunk = createAsyncThunk(
  'chat/getAllConversations',
  async (val: string, { dispatch }) => {
    try {
      dispatch(clearConversationContent())

      const response = await jwt.getAllConversations()

      // console.log("Resonse of conversatoins ===> ")

      const conversations = response.data

      conversations.forEach((conversation: Conversation) => {
        dispatch(
          addConversationChunk({
            conversation: conversation,
          })
        )
      })

      return response.data
    } catch (error: any) {
      const { data } = error.response
      //console.log(data.message)
    }
  }
)

export const getConversation = createAsyncThunk(
  'chat/getConversation',
  async (payload: { conversationId: string }, { dispatch }) => {
    const { conversationId } = payload

    try {
      const response = await jwt.getConversationById(conversationId)

      const conversation_chats = response.data

      dispatch(clearChatContent())

      for (let i = 0; i < conversation_chats.length; i++) {
        const chat = conversation_chats[i]

        dispatch(
          addChatContentChunk({
            extra: {
              message: chat.prompt,
              id: chat.id,
              createdAt: chat.createdAt,
            },
            chunkText: chat.reply,
          })
        )
      }

      dispatch(setFilteredChatContents(conversation_chats))

      return conversation_chats
    } catch (error: any) {
      const { data } = error.response
      //console.log(data.message)
    }
  }
)

export const postConversation = createAsyncThunk(
  'chat/postConversation',
  async (conversation: { prompt: string, randomId: string }, { dispatch }) => {
    try {
      dispatch(
        addChatContentChunk({
          extra: {
            message: conversation.prompt,
            id: conversation.randomId,
          },
          chunkText: "I'm thinking...",
        })
      )

      /* export interface IChatChunk {
        query: string
        response: string
        queryDate: string
        responseDate: string
        newId: string
        currentChatId?: number
      } */

      let conversation_chats = [
        {
          query: conversation.prompt,
          response: "I'm thinking...",
          queryDate: new Date().toISOString(),
          responseDate: new Date().toISOString(),
          newId: conversation.randomId
        }
      ]

      dispatch(setFilteredChatContents(conversation_chats))

      const response = await jwt.postConversation(conversation.prompt)
      const replyObj = response.data
      dispatch(
        setChatContentChunk({
          extra: {
            message: conversation.prompt,
            id: response.data.id,
          },
          chunkText: (response.status === 200) ? replyObj.response : "Ooops! Failed to get response from server",
        })
      )

      let conversation_chats_2 = [
        {
          query: conversation.prompt,
          response: replyObj.response,
          queryDate: new Date().toISOString(),
          responseDate: new Date().toISOString(),
          newId: response.data.id
        }
      ]

      dispatch(setFilteredChatContents(conversation_chats_2))

      return replyObj
    } catch (error: any) {
      const { data } = error.response
      //console.log(data.message)
    }
  }
)

interface ConversationType {
  prompt: string
  id: string
  randomId: string
}

export const continueConversation = createAsyncThunk(
  'chat/continueConversation',
  async (conversation: ConversationType, { dispatch }) => {
    try {
      dispatch(
        addChatContentChunk({
          extra: {
            message: conversation.prompt,
            id: conversation.randomId,
          },
          chunkText: "I'm thinking...",
        })
      )
      const response: any = await jwt.continueConversation(conversation.id, conversation.prompt)

      console.log("Response Status Code: ", response.status)
      console.log(response, "-----------response")

      localStorage.setItem('randomId', conversation.randomId)

      const replyObj = response.data

      dispatch(
        setChatContentChunk({
          extra: {
            message: conversation.prompt,
            // id: conversation.randomId,
            id: response.data.id,
          },
          chunkText: (response.status === 200) ? replyObj.response : "Ooops! Failed to get response from server",
        })
      )

      // console.log('Continue Conversation Response ', response)
    } catch (error: any) {
      const { data } = error.response
    }
  }
)

// Delete a conversation
export const deleteConversationById = createAsyncThunk(
  'chat/deleteConversation',
  async (conversationId: string, { dispatch }) => {
    try {
      const response = await jwt.deleteConversationById(conversationId)

      if (response.status === 200) {
        dispatch(deleteConversationByIdSlice({ conversationId }))
      }

      return response
    } catch (error: any) {
      const { data } = error.response
      return data
    }
  }
)

interface FeedbackType {
  message_id: string
  feedbackData: object
}
// updateFeedback
export const updateFeedbackById = createAsyncThunk(
  'chat/updateFeedback',
  async (feedbackData: FeedbackType, { dispatch }) => {
    try {
      const response = await jwt.updateFeedbackById(feedbackData.message_id, feedbackData.feedbackData)

      // if (response.status === 200) {
      //   dispatch(updateFeedback(feedbackData.message_id))
      // }

      return response
    } catch (error: any) {
      const { data } = error.response
      return data
    }
  }
)