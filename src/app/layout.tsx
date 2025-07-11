import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2wrap.com RAG Chatbot",
  description: "Ask questions and get intelligent answers powered by RAG technology",
  keywords: "2wrap, RAG, chatbot, question answering, artificial intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
