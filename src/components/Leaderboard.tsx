import React from 'react';
import { User } from '../types';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardProps {
  users: User[];
  isLoading?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users, isLoading = false }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-500" />;
      default:
        return <Trophy className="w-5 h-5 text-purple-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-yellow-400/50';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-amber-400/50';
      default:
        return 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-purple-400/50';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-800/90 to-blue-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">Royal Leaderboard</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-purple-700/50 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-purple-500/50 rounded-full"></div>
              <div className="flex-1">
                <div className="w-24 h-4 bg-purple-500/50 rounded"></div>
                <div className="w-16 h-3 bg-purple-500/50 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-200">
      <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-600 animate-bounce" />
        Royal Leaderboard
      </h2>
      
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-105 ${
              index < 3 
                ? 'bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 border-2 border-yellow-400 shadow-lg' 
                : 'bg-purple-50 border border-purple-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${getRankColor(index + 1)}`}>
              {index + 1}
            </div>
            
            <div className="flex items-center gap-3">
              {getRankIcon(index + 1)}
            </div>
            
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full border-3 border-yellow-500 shadow-xl"
            />
            
            <div className="flex-1">
              <p className="font-bold text-purple-800 text-lg">{user.name}</p>
              <p className="text-purple-600 font-medium">💰 {user.totalPoints || 0} gold coins</p>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">{user.totalPoints || 0}</p>
              <p className="text-xs text-purple-500">gold</p>
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <p className="text-center text-purple-500 py-8 text-lg">🏰 No warriors in the arena yet</p>
      )}
    </div>
  );
};