# RAG Chatbot Frontend

A Next.js frontend for interacting with a RAG (Retrieval-Augmented Generation) chatbot API. This application allows users to process websites and ask questions about their content.

## Features

- Process websites by URL with customizable crawling parameters
- Interactive chat interface for querying processed website content
- Responsive design that works on desktop and mobile devices

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- ChatScope UI Kit
- React Icons

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rag-chatbot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_API_URL=https://webbot-production-c4e6.up.railway.app
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
```

Then start the production server:
```bash
npm start
```

## Usage

1. Enter a website URL in the "Process Website" section
2. (Optional) Adjust the max pages and depth settings
3. Click "Process Website" and wait for processing to complete
4. Once processing is done, use the chat interface to ask questions about the website content

## API Endpoints

The application connects to the following API endpoints:

- `POST /process-website`: Processes a website by crawling, chunking, and storing content
- `POST /query`: Queries the RAG system with a user question
