import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Plus } from 'lucide-react';

interface UserSelectorProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onAddUser: (name: string) => void;
  isLoading?: boolean;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUser,
  onUserSelect,
  onAddUser,
  isLoading = false,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onAddUser(newUserName.trim());
      setNewUserName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
        <UserIcon className="w-6 h-6 text-purple-600" />
        Choose Your Champion
      </h2>
      
      <div className="space-y-4">
        <select
          value={selectedUser?.id || ''}
          onChange={(e) => {
            const user = users.find(u => u.id === e.target.value);
            if (user) onUserSelect(user);
          }}
          className="w-full p-4 bg-purple-50 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-900 font-medium"
          disabled={isLoading}
        >
          <option value="" className="bg-white">🏰 Select a warrior...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id} className="bg-white">
              👑 {user.name} ({user.totalPoints || 0} gold)
            </option>
          ))}
        </select>

        {selectedUser && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full border-3 border-yellow-500 shadow-lg"
            />
            <div>
              <p className="font-bold text-purple-800 text-lg">👑 {selectedUser.name}</p>
              <p className="text-purple-600 font-medium">💰 {selectedUser.totalPoints} gold coins</p>
            </div>
          </div>
        )}

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-500 hover:text-purple-800 transition-all duration-300 flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100"
          >
            <Plus className="w-5 h-5" />
            ⚔️ Recruit New Warrior
          </button>
        ) : (
          <form onSubmit={handleAddUser} className="space-y-3">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter warrior name..."
              className="w-full p-4 bg-white border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-900 placeholder-purple-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 font-bold shadow-lg"
              >
                🛡️ Recruit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUserName('');
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 font-bold shadow-lg"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};