# Chat Application Frontend

A real-time chat application built with Next.js 16, React 19, TypeScript, and Socket.IO.

## Features

- Multiple chat rooms
- Real-time messaging using Socket.IO
- Modern UI with Tailwind CSS
- TypeScript for type safety
- Dark mode support
- Responsive design

## Project Structure

```
chat/
├── app/
│   ├── page.tsx                 # Home page - displays all chat rooms
│   ├── room/[roomId]/page.tsx   # Individual chat room page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Message.tsx              # Individual message component
│   ├── MessageInput.tsx         # Message input component
│   └── RoomList.tsx             # Chat room list component
├── lib/
│   └── socket.ts                # Socket.IO connection utility
├── types/
│   └── chat.ts                  # TypeScript type definitions
└── .env.local                   # Environment variables
```

## Prerequisites

- Node.js 18+
- Backend Express server running (in separate repository)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Update these URLs to match your backend server configuration.

## Installation

Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3002`

## Backend API Requirements

Your Express backend should implement the following endpoints:

### REST API Endpoints

- `GET /api/rooms` - Get all chat rooms
  - Response: `ChatRoom[]`

- `GET /api/rooms/:roomId` - Get room details
  - Response: `ChatRoom`

- `GET /api/rooms/:roomId/messages` - Get messages for a room
  - Response: `Message[]`

### Socket.IO Events

**Client → Server:**
- `join_room` - Join a chat room
  - Payload: `{ roomId: string }`

- `send_message` - Send a message
  - Payload: `{ roomId: string, content: string, userId: string, username: string }`

- `leave_room` - Leave a chat room
  - Payload: `{ roomId: string }`

**Server → Client:**
- `message` - Receive a new message
  - Payload: `Message`

- `user_joined` - User joined the room
  - Payload: `{ username: string }`

- `user_left` - User left the room
  - Payload: `{ username: string }`

## Type Definitions

### ChatRoom
```typescript
interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  memberCount: number;
}
```

### Message
```typescript
interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}
```

### User
```typescript
interface User {
  id: string;
  username: string;
}
```

## Build

Build the production version:

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Socket.IO Client** - Real-time communication
- **ESLint** - Code linting

## Notes

- The frontend runs on port 3002 by default
- User IDs and usernames are randomly generated for demo purposes
- In production, you should implement proper authentication
- Make sure your backend server is running before starting the frontend
