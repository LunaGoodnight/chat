"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";
import { ChatRoom, Message as MessageType } from "@/types/chat";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(
    () => `user_${Math.random().toString(36).substr(2, 9)}`,
  );
  const [username] = useState(
    () => `User_${Math.random().toString(36).substr(2, 5)}`,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRoomDetails();
    fetchMessages();
    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchRoomDetails = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${apiUrl}/rooms/${roomId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch room details");
      }

      const data = await response.json();
      setRoom(data);
    } catch (err) {
      console.error("Error fetching room details:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${apiUrl}/rooms/${roomId}/messages`);

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = () => {
    const socket = connectSocket(userId, username);

    socket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
      socket.emit("join_room", { roomId });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    socket.on("message", (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_joined", (data: { username: string }) => {
      console.log(`${data.username} joined the room`);
    });

    socket.on("user_left", (data: { username: string }) => {
      console.log(`${data.username} left the room`);
    });
  };

  const handleSendMessage = (content: string) => {
    const socket = getSocket();

    if (socket && connected) {
      socket.emit("send_message", {
        roomId,
        content,
        userId,
        username,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {room?.name || "Chat Room"}
            </h1>
            {room?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {room.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isOwnMessage={message.userId === userId}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-4xl">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!connected}
          />
        </div>
      </div>
    </div>
  );
}
