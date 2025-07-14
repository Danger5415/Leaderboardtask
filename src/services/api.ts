import { User, PointsHistory } from '../types';

const API_BASE_URL = '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log('🌐 Making API request to:', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 API Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    console.log('📦 API Response data:', data);
    return data;
  }

  async getUsers(): Promise<{ users: User[] }> {
    console.log('👥 Fetching users from API...');
    return this.request<{ users: User[] }>('/users');
  }

  async addUser(name: string): Promise<{ user: User }> {
    return this.request<{ user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async claimPoints(userId: string): Promise<{
    success: boolean;
    pointsAwarded: number;
    newTotalPoints: number;
    user: User;
  }> {
    return this.request<{
      success: boolean;
      pointsAwarded: number;
      newTotalPoints: number;
      user: User;
    }>('/claim-points', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getPointsHistory(): Promise<{ history: PointsHistory[] }> {
    return this.request<{ history: PointsHistory[] }>('/points-history');
  }

  async getLeaderboard(): Promise<{ leaderboard: User[] }> {
    return this.request<{ leaderboard: User[] }>('/leaderboard');
  }
}

export const apiService = new ApiService();