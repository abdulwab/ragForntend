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
            message: `Welcome! Ask me anything.`,
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
      <MainContainer className="h-[590px]">
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