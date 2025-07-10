const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://webbot-production-c4e6.up.railway.app';

// Process a website
export async function processWebsite(url: string, maxPages: number = 5, maxDepth: number = 1) {
  const response = await fetch(`${API_BASE_URL}/process-website`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, max_pages: maxPages, max_depth: maxDepth }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to process website');
  }
  
  return response.json();
}

// Query the RAG system
export async function queryRag(query: string) {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to query RAG system');
  }
  console.log("Chatbot response", response.json());
  return response.json();
} 