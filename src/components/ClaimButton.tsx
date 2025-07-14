import React from 'react';
import { Gift, Loader2 } from 'lucide-react';

interface ClaimButtonProps {
  onClaim: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({
  onClaim,
  isLoading,
  disabled,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
        <Gift className="w-6 h-6 text-purple-600" />
        Treasure Chest
      </h2>
      
      <button
        onClick={onClaim}
        disabled={disabled || isLoading}
        className={`w-full py-6 px-6 rounded-2xl font-bold text-white transition-all transform shadow-2xl text-lg ${
          disabled || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 hover:scale-105 active:scale-95 border-2 border-yellow-400/50 animate-pulse'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            ⚡ Claiming Treasure...
          </div>
        ) : (
          '💎 Claim Royal Treasure (1-10 Gold)'
        )}
      </button>
      
      <p className="text-sm text-purple-600 mt-4 text-center font-medium">
        {disabled
          ? '🏰 Choose your champion first'
          : '⚔️ Click to claim your royal rewards'}
      </p>
    </div>
  );
};