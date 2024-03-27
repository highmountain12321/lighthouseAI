// chatbot-slice.js
import { createSlice } from '@reduxjs/toolkit'
import { Conversation } from '_metronic/layout/components/aside/Tabs/tabTypes';
import { DateType } from '_metronic/partials/layout/search/dateType';
export type ChatQueryType = {
    message: string;
}
const conversationSlice: any = createSlice({
    name: 'conversation',
    initialState: {
        sessions: null,
        currentSession: null,
        conversations: [] as Conversation[],
        filteredConversations: [] as Conversation[],
        searchDateFilter: [new Date(), new Date()] as DateType,
        loading: false,
        error: null
    },
    reducers: {
        addConversationChunk: (state, action: {
            payload: {
                conversation: Conversation
            }
        }) => {
            const { conversation } = action.payload;

            // Ensure conversationContents is initialized
            if (!state.conversations) {
                throw new Error('conversationContents is not initialized');
            }

            // Add new chat content
            state.conversations.push(conversation);
        },
        setFilteredConversations: (state, action: {
            payload: Conversation[]
        }) => {
            // Ensure conversationContents is initialized
            if (!state.conversations) {
                throw new Error('conversationContents is not initialized');
            }

            // Set filtered conversation contents
            state.filteredConversations = action.payload;;
        },

        setSearchDateFilter: (state, action: {
            payload: {
                searchDateFilter: DateType
            }
        }) => {
            const { searchDateFilter } = action.payload;

            // Ensure conversationContents is initialized
            if (!state.conversations) {
                throw new Error('conversationContents is not initialized');
            }

            // Set search date filter
            state.searchDateFilter = searchDateFilter;
        },
        clearConversationContent: (state) => {
            state.conversations = [];
        },
        deleteConversationById: (state, action: {
            payload: {
                conversationId: string
            }
        }) => {
            const { conversationId } = action.payload;

            // Ensure conversationContents is initialized
            if (!state.conversations) {
                throw new Error('conversationContents is not initialized');
            }

            // Remove conversation by id
            state.conversations = state.conversations.filter(conversation => conversation.id !== conversationId);
        }
    },
    selectors: {
        getAllConversationContent: (state) => {
            return state.conversations;
        }
    },
})

export const addConversationChunk = conversationSlice.actions.addConversationChunk;
export const getAllConversationContent = conversationSlice.selectors.getAllConversationContent;
export const clearConversationContent = conversationSlice.actions.clearConversationContent;
export const setFilteredConversations = conversationSlice.actions.setFilteredConversations;
export const setSearchDateFilter = conversationSlice.actions.setSearchDateFilter;
export const deleteConversationByIdSlice = conversationSlice.actions.deleteConversationById;

export default conversationSlice.reducer
