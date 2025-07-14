import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border-2 ${
      type === 'success' 
        ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 border-green-400/50' 
        : 'bg-gradient-to-r from-red-600/90 to-red-700/90 border-red-400/50'
    } text-white font-bold animate-slide-in`}>
      {type === 'success' && <CheckCircle className="w-6 h-6 text-green-200" />}
      <span className="text-lg">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};