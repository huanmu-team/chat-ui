import { Message } from '../types';

export class ChatAPI {
  private agentKey: string;

  constructor(agentKey: 'agent1' | 'agent2') {
    this.agentKey = agentKey;
  }

  async createNewThread(): Promise<string> {
    try {
      const response = await fetch(`/api/agents/${this.agentKey}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create thread: ${response.status}`);
      }

      const data = await response.json();
      return data.threadId;
    } catch (error) {
      throw new Error(`Failed to create new thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendMessage(threadId: string, content: string): Promise<Message> {
    try {
      const response = await fetch(`/api/agents/${this.agentKey}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert timestamp string back to Date object
      return {
        ...data,
        timestamp: new Date(data.timestamp),
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}