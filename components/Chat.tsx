'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, LogOut, RotateCcw } from 'lucide-react';
import { BACKEND_CREDENTIALS, BACKEND_API } from '@/lib/constants';

interface ChatProps {
  userName: string;
  onLogout: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chat({ userName, onLogout }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_API.BASE_URL}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-name': userName.toLowerCase(),
          'password': BACKEND_CREDENTIALS.PASSWORD,
        },
        body: JSON.stringify({
          user_query: input,
          user_name: userName.toLowerCase(),
          session_id: 'conversation',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Unknown error',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch(`${BACKEND_API.BASE_URL}/api/clear_history`, {
        method: 'DELETE',
        headers: {
          'user-name': userName.toLowerCase(),
          'password': BACKEND_CREDENTIALS.PASSWORD,
        },
      });
    } catch (err) {
      console.error('Error clearing history:', err);
    }
    setMessages([]);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_API.BASE_URL}/api/clear_history`, {
        method: 'DELETE',
        headers: {
          'user-name': userName.toLowerCase(),
          'password': BACKEND_CREDENTIALS.PASSWORD,
        },
      });
    } catch (err) {
      console.error('Error clearing history:', err);
    }
    onLogout();
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-300 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Agent Chat</h1>
            <p className="text-sm text-gray-600">Logged in as: {userName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              title="Clear chat"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mx-auto w-full max-w-2xl">
              {/* Greeting */}
              <div className="mb-12 text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {userName.toLowerCase() === 'java' 
                    ? 'Hey, Sweety! Welcome to your analyst.' 
                    : 'Hey, Baddam!'}
                </p>
                <p className="text-lg text-gray-600">
                  Ask me anything about your credit card bills.
                </p>
              </div>

              {/* Search Bar (Input Field) */}
              <div className="mb-8">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>

              {/* Example Questions - Plain Text Links */}
              <div className="space-y-2 text-center">
                <p className="text-sm text-gray-500 mb-3">You can ask questions like:</p>
                <button
                  onClick={() => setInput('What are my recent 5 transactions?')}
                  className="block w-full text-left text-blue-600 hover:text-blue-700 hover:underline"
                >
                  What are my recent 5 transactions?
                </button>
                <button
                  onClick={() => setInput('How much I spent at Sprouts?')}
                  className="block w-full text-left text-blue-600 hover:text-blue-700 hover:underline"
                >
                  How much I spent at Sprouts?
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-3 sm:max-w-md lg:max-w-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white px-4 py-3 shadow">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-red-50 px-4 py-3 shadow">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="border-t border-gray-300 bg-white px-4 py-4 sm:px-6">
          <form onSubmit={sendMessage} className="mx-auto max-w-3xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-400 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
}
