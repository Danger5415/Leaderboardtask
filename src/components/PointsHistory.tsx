import React, { useState, useEffect } from 'react';
import { PointsHistory } from '../types';
import { apiService } from '../services/api';
import { History, Award } from 'lucide-react';

export const PointsHistoryComponent: React.FC = () => {
  const [history, setHistory] = useState<PointsHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchHistory();
    
    // Set up interval to refresh history every 10 seconds (less frequent to avoid flickering)
    const interval = setInterval(() => {
      fetchHistory(false); // Don't show loading on interval refreshes
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async (showLoading = true) => {
    try {
      if (showLoading && isInitialLoad) {
        setIsLoading(true);
      }
      const response = await apiService.getPointsHistory();
      setHistory(response.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      if (showLoading && isInitialLoad) {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">📜 Battle Chronicles</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-purple-100 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-purple-300 rounded-full"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-purple-300 rounded"></div>
                <div className="w-24 h-3 bg-purple-300 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-3">
        <History className="w-6 h-6 text-purple-600" />
        📜 Battle Chronicles
      </h2>
      
      <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 border border-purple-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            
            <img
              src={entry.users.avatar}
              alt={entry.users.name}
              className="w-10 h-10 rounded-full border-2 border-yellow-500 shadow-md"
            />
            
            <div className="flex-1">
              <p className="font-bold text-purple-800">
                ⚔️ {entry.users.name} claimed {entry.pointsAwarded} gold
              </p>
              <p className="text-sm text-purple-600">
                {formatDate(entry.timestamp)}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-xl font-bold text-green-400">💰+{entry.pointsAwarded}</p>
            </div>
          </div>
        ))}
      </div>
      
      {history.length === 0 && (
        <p className="text-center text-purple-500 py-8 text-lg">📜 No battles recorded yet</p>
      )}
    </div>
  );
};