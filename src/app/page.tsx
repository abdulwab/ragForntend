'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [processedUrl] = useState('');

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tight">2wrap.com</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-center text-white">
              2wrap.com RAG Chatbot
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="https://2wrap.com" className="hover:text-indigo-200 transition-colors duration-200">Home</a></li>
              <li><a href="https://2wrap.com/about" className="hover:text-indigo-200 transition-colors duration-200">About</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-144px)] bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-3xl">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-[650px] backdrop-blur-sm bg-white/90">
            <ChatInterface processedUrl={processedUrl} />
          </div>
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">© {new Date().getFullYear()} 2wrap.com</p>
            <p className="text-sm">Powered by RAG Technology</p>
          </div>
        </div>
      </footer>
    </>
  );
}
