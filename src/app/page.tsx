'use client';

import { useState } from 'react';
import WebsiteProcessor from '@/components/WebsiteProcessor';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [processedUrl, setProcessedUrl] = useState('');

  const handleProcessed = (url: string) => {
    setProcessedUrl(url);
  };

  return (
    <main className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Website RAG Chatbot
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Step 1: Process a Website
          </h2>
          <WebsiteProcessor onProcessed={handleProcessed} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md h-[600px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Step 2: Ask Questions
          </h2>
          <ChatInterface processedUrl={processedUrl} />
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Powered by RAG API - {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
