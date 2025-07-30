import { ChatConfig } from '../types';

// Non-sensitive environment defaults
export const getDefaultSettings = () => ({
  agent1Name: process.env.NEXT_PUBLIC_AGENT_1_NAME || '小文',
  agent2Name: process.env.NEXT_PUBLIC_AGENT_2_NAME || '小七',
  maxMessages: parseInt(process.env.NEXT_PUBLIC_MAX_MESSAGES || '100'),
});

// Get initial agent configuration with defaults
export const getInitialAgentConfig = (agentKey: 'agent1' | 'agent2'): ChatConfig => {
  const defaults = getDefaultSettings();
  
  return {
    agentName: agentKey === 'agent1' ? defaults.agent1Name : defaults.agent2Name,
    threadId: '',
    maxMessages: defaults.maxMessages,
  };
};

