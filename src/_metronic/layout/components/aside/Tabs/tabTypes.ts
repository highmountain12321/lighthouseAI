// Define types for the conversation and chat
export interface Chat {
    id: string;
    userId: string | null;
    prompt: string;
    reply: string;
    createdAt: string;
  }
  
  export interface Conversation {
    id: string;
    title: string;
    updated_at: string;
  }

  export interface SingleConversation {
    id: string;
    userId: string | null;
    prompt: string;
    reply: string;
    createdAt: string;
  }