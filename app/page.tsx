'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatPanel, ChatPanelRef } from '../components/ChatPanel';
import { SimultaneousInput } from '../components/SimultaneousInput';
import { ChatConfig } from '../types';
import { getInitialAgentConfig } from '../lib/config';
import { ChatAPI } from '../lib/api';

export default function Home() {
  const agent1Ref = useRef<ChatPanelRef>(null);
  const agent2Ref = useRef<ChatPanelRef>(null);

  const [agent1Config, setAgent1Config] = useState<ChatConfig>(() => getInitialAgentConfig('agent1'));
  const [agent2Config, setAgent2Config] = useState<ChatConfig>(() => getInitialAgentConfig('agent2'));

  // Auto-create threads on page load if server has configuration
  useEffect(() => {
    const createInitialThreads = async () => {
      // Try to create thread for agent 1
      if (!agent1Config.threadId) {
        try {
          const api1 = new ChatAPI('agent1');
          const threadId1 = await api1.createNewThread();
          setAgent1Config(prev => ({ ...prev, threadId: threadId1 }));
        } catch (error) {
          console.warn('Agent 1 not configured on server or failed to create thread:', error);
        }
      }

      // Try to create thread for agent 2
      if (!agent2Config.threadId) {
        try {
          const api2 = new ChatAPI('agent2');
          const threadId2 = await api2.createNewThread();
          setAgent2Config(prev => ({ ...prev, threadId: threadId2 }));
        } catch (error) {
          console.warn('Agent 2 not configured on server or failed to create thread:', error);
        }
      }
    };

    createInitialThreads();
  }, []); // Run once on mount

  const handleSimultaneousMessage = async (content: string) => {
    // Send message to both agents simultaneously
    const promises = [];
    
    if (agent1Ref.current && agent1Config.threadId) {
      promises.push(agent1Ref.current.sendMessage(content));
    }
    
    if (agent2Ref.current && agent2Config.threadId) {
      promises.push(agent2Ref.current.sendMessage(content));
    }

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending simultaneous messages:', error);
    }
  };

  const [isHydrated, setIsHydrated] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const canSendSimultaneous = () => {
    if (!isHydrated) return false;
    const agent1Ready = agent1Config.threadId;
    const agent2Ready = agent2Config.threadId;
    return agent1Ready || agent2Ready;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                智能体对比仪表板
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                并行测试两个 LangGraph 智能代理
              </p>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
          {/* 小文 Panel */}
          <div className="h-full">
            <ChatPanel
              ref={agent1Ref}
              config={agent1Config}
              onConfigChange={setAgent1Config}
              agentKey="agent1"
            />
          </div>

          {/* 小七 Panel */}
          <div className="h-full">
            <ChatPanel
              ref={agent2Ref}
              config={agent2Config}
              onConfigChange={setAgent2Config}
              agentKey="agent2"
            />
          </div>
        </div>
      </main>

      {/* Simultaneous Input Section */}
      <SimultaneousInput
        onSendMessage={handleSimultaneousMessage}
        disabled={!canSendSimultaneous()}
        placeholder={!canSendSimultaneous() ? '请至少配置一个智能体后再发送消息...' : '同时向两个智能体发送消息...'}
      />
    </div>
  );
}