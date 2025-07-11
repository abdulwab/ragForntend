'use client';

import { useState, useEffect, useRef } from 'react';
import { queryRag } from '@/lib/api-client';
import { FiTrash2 } from 'react-icons/fi';

interface ChatMessage {
  message: string;
  sender: 'user' | 'assistant' | 'system';
  direction: 'incoming' | 'outgoing';
  position: 'single' | 'first' | 'normal' | 'last';
}

interface ChatInterfaceProps {
  processedUrl: string;
  currentChatId: string | null;
  onChatUpdate?: (chatId: string) => void;
}

export default function ChatInterface({ processedUrl, currentChatId, onChatUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  // Load messages from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatHistory');
      const savedUrl = localStorage.getItem('processedUrl');
      
      console.log('Loading from localStorage - savedUrl:', savedUrl, 'processedUrl:', processedUrl);
      
      if (savedMessages && savedUrl && savedUrl === processedUrl) {
        console.log('Found matching saved messages, loading from localStorage');
        setMessages(JSON.parse(savedMessages));
        setCurrentUrl(savedUrl);
      } else {
        console.log('No matching saved messages found');
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, [processedUrl]);

  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      if (messages.length > 0 && currentUrl) {
        console.log('Saving messages to localStorage, count:', messages.length);
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        localStorage.setItem('processedUrl', currentUrl);
      }
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages, currentUrl]);

  // Add welcome message when component mounts or when a new URL is processed
  useEffect(() => {
    try {
      console.log('Welcome message effect - messages:', messages.length, 'currentUrl:', currentUrl, 'processedUrl:', processedUrl);
      
      // If no messages and no URL processed yet, show default welcome
      if (messages.length === 0 && !currentUrl) {
        console.log('Setting default welcome message');
        setMessages([
          {
            message: `Welcome to 2wrap.com! How can I help you with 2wrap's products or services today?`,
            sender: 'system',
            direction: 'incoming',
            position: 'single'
          }
        ]);
      }
      // If a new URL is processed, show website-specific welcome
      else if (processedUrl && processedUrl !== currentUrl) {
        console.log('Setting website-specific welcome message for:', processedUrl);
        setMessages([
          {
            message: `Website processed: ${processedUrl}. What would you like to know about it?`,
            sender: 'system',
            direction: 'incoming',
            position: 'single'
          }
        ]);
        setCurrentUrl(processedUrl);
      }
    } catch (error) {
      console.error('Error setting welcome message:', error);
    }
  }, [processedUrl, currentUrl, messages.length]);

  // Reset messages when starting a new chat
  useEffect(() => {
    if (currentChatId === null) {
      setMessages([
        {
          message: `Welcome to 2wrap.com! How can I help you with 2wrap's products or services today?`,
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        }
      ]);
    }
  }, [currentChatId]);

  // Auto-scroll to bottom only when new messages are added or typing starts
  useEffect(() => {
    if (shouldAutoScroll.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Check if user is scrolled to bottom to determine if we should auto-scroll
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      shouldAutoScroll.current = isAtBottom;
    }
  };

  const handleSend = async (query: string) => {
    console.log('Sending query:', query);
    
    // Add user message
    const userMessage: ChatMessage = {
      message: query,
      sender: 'user',
      direction: 'outgoing',
      position: 'single'
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      console.log('Calling queryRag API...');
      // Query RAG API
      const response = await queryRag(query);
      console.log('Response received from queryRag:', response);
      
      if (!response || !response.answer) {
        console.error('Invalid response format:', response);
        throw new Error('Received invalid response format from server');
      }
      
      // Add AI response
      const botMessage: ChatMessage = {
        message: response.answer,
        sender: 'assistant',
        direction: 'incoming',
        position: 'single'
      };
      console.log('Adding bot message to chat:', botMessage);
      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        
        // Update chat session if callback provided
        if (onChatUpdate && currentChatId) {
          onChatUpdate(currentChatId);
        }
        
        return newMessages;
      });
    } catch (error) {
      console.error('Error in handleSend:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        message: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        sender: 'system',
        direction: 'incoming',
        position: 'single'
      };
      console.log('Adding error message to chat:', errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    
    // Re-add welcome message
    if (currentUrl) {
      // If a URL is processed, show website-specific welcome
      setMessages([
        {
          message: `Website processed: ${currentUrl}. What would you like to know about it?`,
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        }
      ]);
    } else {
      // Otherwise show default welcome
      setMessages([
        {
          message: `Welcome to 2wrap.com! How can I help you with 2wrap's products or services today?`,
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">2wrap.com RAG Chatbot</h1>
          <div className="text-sm text-gray-500">
            {messages.length > 0 ? `${messages.length} messages` : 'Start a conversation'}
          </div>
        </div>
        <button 
          onClick={clearChat}
          disabled={messages.length === 0}
          className={`flex items-center text-sm px-3 py-1.5 rounded-lg transition-all ${
            messages.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          <FiTrash2 className="mr-1.5" size={14} />
          Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 min-h-0">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto px-4 md:px-8 py-6"
            onScroll={handleScroll}
          >
            <div className="max-w-4xl mx-auto space-y-6 pb-24">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="text-lg font-medium text-gray-700 mb-1">Welcome to 2wrap.com!</div>
                  <div className="text-sm text-gray-500 text-center max-w-md">
                    Ask me about 2wrap&apos;s products, services, or how we can help with your wrapping needs.
                  </div>
                </div>
              )}
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gray-100 text-gray-800'
                        : message.sender === 'system'
                        ? 'bg-gray-100 text-gray-600 italic'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-2xl max-w-xs italic flex items-center space-x-1">
                    <span>2wrap assistant is responding</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        
        {/* Input Field */}
        <div className="flex-shrink-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="w-full max-w-3xl mx-auto flex items-center gap-3 px-4 py-3 bg-transparent border border-gray-300 rounded-3xl focus-within:bg-white focus-within:border-gray-700 focus-within:shadow-lg transition-all duration-200">
              <input
                type="text"
                placeholder="Ask about 2wrap's products or services..."
                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none text-gray-800 placeholder-gray-500"
                style={{ 
                  boxShadow: 'none',
                  border: 'none',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.border = 'none';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSend(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    handleSend(input.value);
                    input.value = '';
                  }
                }}
                className="w-9 h-9 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 