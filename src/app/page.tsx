'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [processedUrl] = useState('');

  return (
    <main className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        AI Chatbot
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md h-[700px]">
          <ChatInterface processedUrl={processedUrl} />
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Powered by AI - {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
