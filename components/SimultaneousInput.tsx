'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface SimultaneousInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SimultaneousInput({ onSendMessage, disabled = false, placeholder = '同时向两个智能体发送消息...' }: SimultaneousInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-[99999] fixed bottom-0 left-0 right-0">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
            style={{ minHeight: '60px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="absolute right-2 bottom-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        按 Enter 发送，Shift+Enter 换行
      </div>
    </div>
  );
}