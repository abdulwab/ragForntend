'use client';

import { useState, useEffect } from 'react';
import { queryRag } from '@/lib/api-client';
import { 
  MainContainer, ChatContainer, MessageList, Message, 
  MessageInput, TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { FiTrash2 } from 'react-icons/fi';

interface ChatMessage {
  message: string;
  sender: 'user' | 'assistant' | 'system';
  direction: 'incoming' | 'outgoing';
  position: 'single' | 'first' | 'normal' | 'last';
}

interface ChatInterfaceProps {
  processedUrl: string;
}

export default function ChatInterface({ processedUrl }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedUrl = localStorage.getItem('processedUrl');
    
    if (savedMessages && savedUrl && savedUrl === processedUrl) {
      setMessages(JSON.parse(savedMessages));
      setCurrentUrl(savedUrl);
    }
  }, [processedUrl]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0 && currentUrl) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      localStorage.setItem('processedUrl', currentUrl);
    }
  }, [messages, currentUrl]);

  // Add welcome message when component mounts or when a new URL is processed
  useEffect(() => {
    // If no messages and no URL processed yet, show default welcome
    if (messages.length === 0 && !currentUrl) {
      setMessages([
        {
          message: `Welcome! Ask me anything.`,
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        }
      ]);
    }
    // If a new URL is processed, show website-specific welcome
    else if (processedUrl && processedUrl !== currentUrl) {
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
  }, [processedUrl, currentUrl, messages.length]);

  const handleSend = async (query: string) => {
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
      // Query RAG API
      const response = await queryRag(query);
      
      // Add AI response
      const botMessage: ChatMessage = {
        message: response.answer,
        sender: 'assistant',
        direction: 'incoming',
        position: 'single'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: ChatMessage = {
        message: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        sender: 'system',
        direction: 'incoming',
        position: 'single'
      };
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
          message: `Welcome! Ask me anything.`,
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        }
      ]);
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between mb-2">
        <div className="text-sm text-gray-500">
          {messages.length > 0 ? `${messages.length} messages` : 'No messages yet'}
        </div>
        <button 
          onClick={clearChat}
          disabled={messages.length === 0}
          className={`flex items-center text-sm ${messages.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-red-500 transition-colors'}`}
        >
          <FiTrash2 className="mr-1" />
          Clear Chat
        </button>
      </div>
      <MainContainer className="h-[460px]">
        <ChatContainer>
          <MessageList
            typingIndicator={isTyping ? <TypingIndicator content="AI is thinking" /> : null}
            scrollBehavior="smooth"
          >
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-400 text-center p-4">
                Ask a question to start chatting
              </div>
            )}
            {messages.map((message, i) => (
              <Message
                key={i}
                model={{
                  message: message.message,
                  sender: message.sender,
                  direction: message.direction,
                  position: message.position
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type your question here..."
            onSend={handleSend}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
} 