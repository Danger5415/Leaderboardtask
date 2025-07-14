export interface User {
  id: string;
  name: string;
  totalPoints: number;
  avatar: string;
  created_at: string;
  updated_at: string;
  rank?: number;
}

export interface PointsHistory {
  id: string;
  userId: string;
  pointsAwarded: number;
  timestamp: string;
  users: {
    name: string;
    avatar: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}