export interface User {
  _id: string;
  username: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserJoinedEvent {
  username: string;
  timestamp: string;
  userId: string;
}

export interface UserLeftEvent {
  username: string;
  timestamp: string;
}

export interface UserStatusEvent {
  username: string;
  status: string;
  timestamp: string;
}

export interface ConnectedEvent {
  message: string;
  socketId: string;
  timestamp: string;
}

export interface PositionedUser {
  username: string;
  x: number;
  y: number;
  id: string;
  timestamp: number;
}
