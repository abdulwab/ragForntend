'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [processedUrl] = useState('');

  return (
    <>
      <header className="bg-blue-600 text-white py-3 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-xl">2wrap.com</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="https://2wrap.com" className="hover:underline">Home</a></li>
              <li><a href="https://2wrap.com/about" className="hover:underline">About</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          2wrap.com RAG Chatbot
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md h-[650px]">
            <ChatInterface processedUrl={processedUrl} />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} 2wrap.com</p>
            <p className="text-sm text-gray-500">Powered by RAG Technology</p>
          </div>
        </div>
      </footer>
    </>
  );
}
