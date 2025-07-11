'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className={`flex-1 h-full transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <ChatInterface 
          processedUrl=""
          currentChatId={currentChatId}
          onChatUpdate={(chatId: string) => {
            // Update chat session in sidebar if needed
            setCurrentChatId(chatId);
          }}
        />
      </div>
    </div>
  );
}
