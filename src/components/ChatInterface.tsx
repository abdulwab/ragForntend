'use client';

import { useState, useEffect } from 'react';
import { queryRag } from '@/lib/api-client';
import { 
  MainContainer, ChatContainer, MessageList, Message, 
  MessageInput, TypingIndicator 
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

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

  // Add welcome message when a new URL is processed
  useEffect(() => {
    if (processedUrl) {
      setMessages([
        {
          message: `Website processed: ${processedUrl}. What would you like to know about it?`,
          sender: 'system',
          direction: 'incoming',
          position: 'single'
        }
      ]);
    }
  }, [processedUrl]);

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

  return (
    <div className="h-full">
      <MainContainer className="h-[500px]">
        <ChatContainer>
          <MessageList
            typingIndicator={isTyping ? <TypingIndicator content="AI is thinking" /> : null}
          >
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