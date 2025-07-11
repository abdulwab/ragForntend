'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiMenu, FiX } from 'react-icons/fi';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ onNewChat, onSelectChat, currentChatId, isOpen, onToggle }: SidebarProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  // Load chat sessions from localStorage
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        setChatSessions(sessions.map((session: ChatSession & { timestamp: string }) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  }, []);

  // Save chat sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }, [chatSessions]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      messageCount: 0
    };
    setChatSessions(prev => [newSession, ...prev]);
    onNewChat();
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (currentChatId === chatId) {
      onNewChat();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:z-auto
        w-64 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">2wrap.com</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <FiPlus size={18} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Chats</h3>
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSelectChat(session.id)}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                    ${currentChatId === session.id 
                      ? 'bg-gray-800 border border-gray-600' 
                      : 'hover:bg-gray-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FiMessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(session.timestamp)} • {session.messageCount} messages
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                  >
                    <FiTrash2 size={14} className="text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
              {chatSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FiMessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No chat history yet</p>
                  <p className="text-xs">Start a new conversation to see it here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            <p>© 2024 2wrap.com</p>
            <p className="mt-1">Powered by RAG Technology</p>
          </div>
        </div>
      </div>

      {/* Menu button - only show when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-30 p-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
        >
          <FiMenu size={20} />
        </button>
      )}
    </>
  );
} 