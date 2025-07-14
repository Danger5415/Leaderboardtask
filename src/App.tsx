import React, { useState, useEffect } from 'react';
import { User } from './types';
import { apiService } from './services/api';
import { UserSelector } from './components/UserSelector';
import { ClaimButton } from './components/ClaimButton';
import { Leaderboard } from './components/Leaderboard';
import { PointsHistoryComponent } from './components/PointsHistory';
import { NotificationToast } from './components/NotificationToast';
import { Trophy, Gamepad2 } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true);
      const response = await apiService.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      addNotification('Error loading users', 'error');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const addNotification = (message: string, type: 'success' | 'error') => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleAddUser = async (name: string) => {
    try {
      await apiService.addUser(name);
      addNotification(`User "${name}" added successfully!`, 'success');
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      addNotification('Error adding user', 'error');
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      const response = await apiService.claimPoints(selectedUser.id);
      
      addNotification(
        `${selectedUser.name} claimed ${response.pointsAwarded} points!`,
        'success'
      );
      
      // Auto-refresh page after 0.8 seconds
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error('Error claiming points:', error);
      
      // Even on error, refresh to check if points were actually claimed
      addNotification('Checking status...', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-300/50 animate-pulse">
              <Gamepad2 className="w-8 h-8 text-purple-900" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              Royal Arena
            </h1>
          </div>
          <p className="text-yellow-200/80 text-xl font-medium">
            ⚔️ Battle for Glory • Claim Your Rewards • Rule the Kingdom ⚔️
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Left Column - User Controls */}
          <div className="space-y-6">
            <UserSelector
              users={users}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              onAddUser={handleAddUser}
              isLoading={isUsersLoading}
            />
            
            <ClaimButton
              onClaim={handleClaimPoints}
              isLoading={isLoading}
              disabled={!selectedUser || isUsersLoading}
            />
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-2">
            <Leaderboard users={users} isLoading={isUsersLoading} />
          </div>
        </div>

        {/* Points History */}
        <div className="mt-8">
          <PointsHistoryComponent />
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;