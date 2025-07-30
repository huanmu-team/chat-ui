'use client';

import { useState } from 'react';
import { ChatPanel } from '../components/ChatPanel';
import { ChatConfig } from '../types';

export default function Home() {
  const [agent1Config, setAgent1Config] = useState<ChatConfig>({
    agentName: '小文',
    apiKey: '',
    threadId: '',
    agentId: '',
    maxMessages: 100,
  });

  const [agent2Config, setAgent2Config] = useState<ChatConfig>({
    agentName: '小七',
    apiKey: '',
    threadId: '',
    agentId: '',
    maxMessages: 100,
  });

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* 小文 Panel */}
          <div className="h-full">
            <ChatPanel
              config={agent1Config}
              onConfigChange={setAgent1Config}
            />
          </div>

          {/* 小七 Panel */}
          <div className="h-full">
            <ChatPanel
              config={agent2Config}
              onConfigChange={setAgent2Config}
            />
          </div>
        </div>
      </main>
    </div>
  );
}