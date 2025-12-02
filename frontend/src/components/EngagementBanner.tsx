'use client';

import { useState } from 'react';
import { ThumbsUp, Star, X } from 'lucide-react';

interface EngagementBannerProps {
  fixtureName: string;
  onEngaged: () => void;
}

export default function EngagementBanner({ fixtureName, onEngaged }: EngagementBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasEngaged, setHasEngaged] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('riderready-has-engaged') === 'true';
    }
    return false;
  });

  if (isDismissed || hasEngaged) return null;

  const handleEngage = () => {
    setHasEngaged(true);
    localStorage.setItem('riderready-has-engaged', 'true');
    onEngaged();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9998] max-w-md">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-2xl p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <ThumbsUp className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Have you used the {fixtureName}?
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Share your experience! Your feedback helps the lighting community make better decisions.
            </p>
            <button
              onClick={handleEngage}
              className="w-full bg-white text-amber-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Star className="w-5 h-5" />
              <span>Rate This Fixture</span>
            </button>
            <button
              onClick={handleDismiss}
              className="w-full mt-2 text-white/80 hover:text-white text-sm py-2 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
