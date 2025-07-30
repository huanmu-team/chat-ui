import { Message } from '../types';

export class LangGraphAPI {
  private apiKey: string;
  private threadId: string;
  private baseUrl: string;
  private agentId: string;

  constructor(apiKey: string, threadId: string, agentId: string, baseUrl = 'https://api.langchain.com') {
    this.apiKey = apiKey;
    this.threadId = threadId;
    this.baseUrl = baseUrl;
    this.agentId = agentId;
  }

  async sendMessage(content: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}/threads/${this.threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant_id: this.agentId,
          thread: {
            messages: [
              {
                role: 'user',
                content: content,
              },
            ],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the response to match our Message interface
      return {
        id: data.id || Date.now().toString(),
        content: data.content || data.message || 'No response',
        role: 'assistant',
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/threads/${this.threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the response to match our Message interface
      return data.messages?.map((msg: any) => ({
        id: msg.id || Date.now().toString(),
        content: msg.content || '',
        role: msg.role || 'assistant',
        timestamp: new Date(msg.created_at || Date.now()),
      })) || [];
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}