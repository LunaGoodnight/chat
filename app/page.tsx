'use client';

import { useState, useEffect } from 'react';
import RoomList from '@/components/RoomList';
import { ChatRoom } from '@/types/chat';

export default function Home() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/rooms`);

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError('Unable to load chat rooms. Please ensure the backend server is running.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Chat Rooms
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Select a room to start chatting
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={fetchRooms}
              className="mt-3 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <RoomList rooms={rooms} />
        )}
      </div>
    </div>
  );
}
