'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LangGraphAPI } from '../lib/api';
import { Message, ChatConfig } from '../types';
import { Settings, MessageSquare, Trash2 } from 'lucide-react';

interface ChatPanelProps {
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
}

export interface ChatPanelRef {
  sendMessage: (content: string) => Promise<void>;
}

export const ChatPanel = forwardRef<ChatPanelRef, ChatPanelProps>(({ config, onConfigChange }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to enforce maximum message limit
  const enforceMessageLimit = (newMessages: Message[]): Message[] => {
    const maxMessages = config.maxMessages || 100; // Default to 100 messages
    if (newMessages.length > maxMessages) {
      return newMessages.slice(-maxMessages); // Keep only the most recent messages
    }
    return newMessages;
  };

  // Function to clear chat history
  const clearChatHistory = () => {
    setMessages([]);
    setError(null);
  };

  // Expose sendMessage function via ref
  useImperativeHandle(ref, () => ({
    sendMessage: handleSendMessage
  }));

  const handleSendMessage = async (content: string) => {
    if (!config.apiKey || !config.threadId || !config.agentId) {
      setError('请配置 API key 和 thread ID 和 agent ID');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => enforceMessageLimit([...prev, userMessage]));
    setIsLoading(true);
    setError(null);

    try {
      const api = new LangGraphAPI(config.apiKey, config.threadId, config.agentId, config.baseUrl);
      const response = await api.sendMessage(content);
      setMessages(prev => enforceMessageLimit([...prev, response]));
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSave = (newConfig: ChatConfig) => {
    onConfigChange(newConfig);
    setShowConfig(false);
    setMessages([]); // Clear messages when config changes
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {config.agentName || '智能体'}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({messages.length}/{config.maxMessages || 100})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChatHistory}
            disabled={messages.length === 0}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="清除聊天记录"
          >
            <Trash2 size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="设置"
          >
            <Settings size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <ConfigForm config={config} onSave={handleConfigSave} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !config.apiKey || !config.threadId || !config.agentId}
        placeholder={!config.apiKey || !config.threadId || !config.agentId ? '请先配置 API 和 Thread ID...' : '输入消息'}
      />
    </div>
  );
});

interface ConfigFormProps {
  config: ChatConfig;
  onSave: (config: ChatConfig) => void;
}

function ConfigForm({ config, onSave }: ConfigFormProps) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          智能体ID
        </label>
        <input
          type="text"
          value={formData.agentId}
          onChange={(e) => setFormData(prev => ({ ...prev, agentId: e.target.value }))}
          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          placeholder="智能体ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          API Key
        </label>
        <input
          type="password"
          value={formData.apiKey}
          onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          placeholder="LangGraph API Key"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Thread ID
        </label>
        <input
          type="text"
          value={formData.threadId}
          onChange={(e) => setFormData(prev => ({ ...prev, threadId: e.target.value }))}
          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          placeholder="LangGraph Thread ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          API Base URL (可选)
        </label>
        <input
          type="url"
          value={formData.baseUrl || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          placeholder="https://api.langchain.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          最大消息数量 (默认100)
        </label>
        <input
          type="number"
          min="10"
          max="1000"
          value={formData.maxMessages || 100}
          onChange={(e) => setFormData(prev => ({ ...prev, maxMessages: parseInt(e.target.value) || 100 }))}
          className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          placeholder="100"
        />
      </div>
      <button
        type="submit"
        className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        保存配置
      </button>
    </form>
  );
}

ChatPanel.displayName = 'ChatPanel';