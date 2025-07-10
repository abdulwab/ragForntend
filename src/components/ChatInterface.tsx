'use client';

import { useState, useEffect, useRef } from 'react';
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
  
  // Handle mouse enter/leave for chat container to control body scrolling
  useEffect(() => {
    const handleMouseEnter = () => {
      document.body.classList.add('chat-hover');
    };
    
    const handleMouseLeave = () => {
      document.body.classList.remove('chat-hover');
    };
    
    // Get the chat container element
    const chatContainer = chatContainerRef.current;
    
    if (chatContainer) {
      chatContainer.addEventListener('mouseenter', handleMouseEnter);
      chatContainer.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('mouseenter', handleMouseEnter);
        chatContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

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
      setMessages(prev => [...prev, botMessage]);
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
    <div className="h-full">
      <div className="flex justify-between mb-3">
        <div className="text-sm text-indigo-600 font-medium">
          {messages.length > 0 ? `${messages.length} messages` : 'Start a conversation'}
        </div>
        <button 
          onClick={clearChat}
          disabled={messages.length === 0}
          className={`flex items-center text-sm px-3 py-1 rounded-full ${
            messages.length === 0 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200'
          }`}
        >
          <FiTrash2 className="mr-1.5" />
          Clear Chat
        </button>
      </div>
      <div ref={chatContainerRef} className="chat-container-wrapper">
        <MainContainer className="h-[590px] rounded-xl overflow-hidden border border-indigo-100 overflow-y-hidden">
          <ChatContainer>
            <MessageList
              typingIndicator={
                isTyping ? 
                  <TypingIndicator 
                    content="AI is thinking" 
                    style={{
                      background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
                      color: 'white',
                      padding: '16px 20px',
                      borderRadius: '18px',
                      fontSize: '14px',
                      whiteSpace: 'pre-wrap',
                      maxWidth: 'none',
                      width: 'auto'
                    }}
                  /> 
                  : null
              }
              scrollBehavior="smooth"
              className="custom-message-list"
            >
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
                <Message
                  key={i}
                  model={{
                    message: message.message,
                    sender: message.sender,
                    direction: message.direction,
                    position: message.position
                  }}
                  style={{
                    ...(message.sender === 'assistant' && {
                      background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
                      color: 'white',
                      padding: '16px 20px',
                      borderRadius: '18px',
                      whiteSpace: 'pre-wrap',
                      maxWidth: 'none',
                      width: 'auto',
                    }),
                    ...(message.sender === 'user' && {
                      background: '#f3f4f6',
                      color: '#1f2937',
                      padding: '16px 20px',
                      borderRadius: '18px',
                      whiteSpace: 'pre-wrap',
                      maxWidth: 'none',
                      width: 'auto',
                    }),
                    ...(message.sender === 'system' && {
                      background: '#eff6ff',
                      color: '#1e40af',
                      padding: '16px 20px',
                      borderRadius: '18px',
                      whiteSpace: 'pre-wrap',
                      maxWidth: 'none',
                      width: 'auto',
                    })
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Ask about 2wrap's products or services..."
              onSend={handleSend}
              attachButton={false}
              style={{
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                padding: '16px 20px',
              }}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
} 