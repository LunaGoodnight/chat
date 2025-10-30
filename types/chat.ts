export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  memberCount: number;
}

export interface User {
  id: string;
  username: string;
}