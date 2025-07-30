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
      const response = await fetch(`${this.baseUrl}/threads/${this.threadId}/runs/wait`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant_id: this.agentId,
          input: {
            messages: [
              {
                role: 'user',
                type: 'human',
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
      
      // Extract the last_message from the response
      const lastMessage = data.last_message;
      if (!lastMessage) {
        throw new Error('No response message received from agent');
      }
      
      // Transform the response to match our Message interface
      return {
        id: lastMessage.id || Date.now().toString(),
        content: lastMessage.content || 'No response',
        role: 'assistant',
        timestamp: new Date(lastMessage.created_at || Date.now()),
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}