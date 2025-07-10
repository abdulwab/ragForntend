const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://webbot-production-c4e6.up.railway.app';

// Process a website
export async function processWebsite(url: string, maxPages: number = 5, maxDepth: number = 1) {
  console.log(`Processing website: ${url} with maxPages: ${maxPages}, maxDepth: ${maxDepth}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/process-website`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, max_pages: maxPages, max_depth: maxDepth }),
    });
    
    console.log(`Process website response status: ${response.status}`);
    
    if (!response.ok) {
      // Clone the response before reading it
      const clonedResponse = response.clone();
      let errorMessage = 'Failed to process website';
      
      try {
        const errorData = await clonedResponse.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Website processed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error processing website:', error);
    throw error;
  }
}

// Query the RAG system
export async function queryRag(query: string) {
  console.log(`Querying RAG system with: "${query}"`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    console.log(`Query response status: ${response.status}`);
    
    if (!response.ok) {
      // Clone the response before reading it
      const clonedResponse = response.clone();
      let errorMessage = 'Failed to query RAG system';
      
      try {
        const errorData = await clonedResponse.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Query successful, response:', data);
    return data;
  } catch (error) {
    console.error('Error querying RAG system:', error);
    throw error;
  }
} 