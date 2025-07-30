export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatConfig {
  agentName: string;
  apiKey: string;
  threadId: string;
  agentId: string;
  maxMessages?: number; // Maximum number of messages to keep in memory
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}