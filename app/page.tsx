// src/app/page.tsx
'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export default function Home() {
  const [query, setQuery] = useState('restaurants in Chennai');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setMessage('Error: API URL is not configured. Please contact the administrator.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred from the backend.');
      }

      setMessage(data.message);
    } catch (error) {
      // ✅ CORRECTED BLOCK: Check the error type before using it.
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(`An unexpected error occurred: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-cyan-400">Google Maps Scraper</h1>
        <p className="text-center text-gray-400">Enter a search query to scrape data into your Google Sheet.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-300">Search Query</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., cafes in Chennai"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Scraping in Progress...' : 'Start Scraping'}
          </button>
        </form>

        {message && (
          <div className={`p-4 mt-4 text-center text-sm rounded-md ${message.startsWith('Error') ? 'bg-red-800 text-red-100' : 'bg-gray-700 text-gray-200'}`}>
            {message}
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-xs text-gray-500">
        <p>This tool is for educational purposes only. Scraping may be against Google's Terms of Service.</p>
      </footer>
    </main>
  );
}